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
// https://jira.sonarsource.com/browse/RSPEC-1940

import { Rule, SourceCode } from "eslint";
import { Node, CatchClause, Statement, Pattern } from "estree";
import { isThrowStatement } from "../utils/nodes";
import { areEquivalent } from "../utils/equivalence";

const MESSAGE = "Add logic to this catch clause or eliminate it and rethrow the exception automatically.";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: '"catch" clauses should do more than rethrow',
      category: "Code Smell Detection",
      recommended: true,
      url: "https://github.com/es-joy/eslint-plugin-radar/blob/master/docs/rules/no-useless-catch.md",
    },
  },
  create(context: Rule.RuleContext) {
    return { CatchClause: (node: Node) => visitCatchClause(node as CatchClause, context) };
  },
};

function visitCatchClause(catchClause: CatchClause, context: Rule.RuleContext) {
  const statements = catchClause.body.body;
  if (
    catchClause.param &&
    statements.length === 1 &&
    onlyRethrows(statements[0], catchClause.param, context.getSourceCode())
  ) {
    const catchKeyword = context.getSourceCode().getFirstToken(catchClause)!;
    context.report({
      message: MESSAGE,
      loc: catchKeyword.loc,
    });
  }
}

function onlyRethrows(statement: Statement, catchParam: Pattern, sourceCode: SourceCode) {
  return isThrowStatement(statement) && areEquivalent(catchParam, statement.argument, sourceCode);
}

export = rule;
