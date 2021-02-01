/*
 * eslint-plugin-sonarjs
 * Copyright (C) 2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation,
 * version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */
// https://jira.sonarsource.com/browse/RSPEC-1264

import { Rule } from "eslint";
import * as estree from "estree";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: 'A "while" loop should be used instead of a "for" loop',
      category: "Code Smell Detection",
      recommended: true,
      url: "https://github.com/es-joy/eslint-plugin-radar/blob/master/docs/rules/prefer-while.md",
    },
    fixable: "code",
  },
  create(context: Rule.RuleContext) {
    return {
      ForStatement(node: estree.Node) {
        const forLoop = node as estree.ForStatement;
        const forKeyword = context.getSourceCode().getFirstToken(node);
        if (!forLoop.init && !forLoop.update && forKeyword) {
          context.report({
            message: `Replace this "for" loop with a "while" loop.`,
            loc: forKeyword.loc,
            fix: getFix(forLoop),
          });
        }
      },
    };

    function getFix(forLoop: estree.ForStatement): any {
      const forLoopRange = forLoop.range;
      const closingParenthesisToken = context.getSourceCode().getTokenBefore(forLoop.body);
      const condition = forLoop.test;

      if (condition && forLoopRange && closingParenthesisToken) {
        return (fixer: Rule.RuleFixer) => {
          const start = forLoopRange[0];
          const end = closingParenthesisToken.range[1];
          const conditionText = context.getSourceCode().getText(condition);
          return fixer.replaceTextRange([start, end], `while (${conditionText})`);
        };
      }

      return undefined;
    }
  },
};

export = rule;
