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
// https://jira.sonarsource.com/browse/RSPEC-3972

import { AST, Rule } from "eslint";
import * as estree from "estree";
import { toEncodedMessage } from "../utils/locations";

interface SiblingIfStatement {
  first: estree.IfStatement;
  following: estree.IfStatement;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Conditionals should start on new lines",
      category: "Code Smell Detection",
      recommended: true,
      url: "https://github.com/es-joy/eslint-plugin-radar/blob/master/docs/rules/no-same-line-conditional.md",
    },
    schema: [
      {
        // internal parameter
        enum: ["radar-runtime"],
      },
    ],
  },
  create(context: Rule.RuleContext) {
    function checkStatements(statements: estree.Node[]) {
      const sourceCode = context.getSourceCode();
      const siblingIfStatements = getSiblingIfStatements(statements);

      siblingIfStatements.forEach((siblingIfStatement) => {
        const precedingIf = siblingIfStatement.first;
        const followingIf = siblingIfStatement.following;
        if (
          !!precedingIf.loc &&
          !!followingIf.loc &&
          precedingIf.loc.end.line === followingIf.loc.start.line &&
          precedingIf.loc.start.line !== followingIf.loc.end.line
        ) {
          const precedingIfLastToken = sourceCode.getLastToken(precedingIf) as AST.Token;
          const followingIfToken = sourceCode.getFirstToken(followingIf) as AST.Token;
          context.report({
            message: toEncodedMessage(`Move this "if" to a new line or add the missing "else".`, [
              precedingIfLastToken,
            ]),
            loc: followingIfToken.loc,
          });
        }
      });
    }

    return {
      Program: (node: estree.Node) => checkStatements((node as estree.Program).body),
      BlockStatement: (node: estree.Node) => checkStatements((node as estree.BlockStatement).body),
      SwitchCase: (node: estree.Node) => checkStatements((node as estree.SwitchCase).consequent),
    };
  },
};

function getSiblingIfStatements(statements: estree.Node[]): SiblingIfStatement[] {
  return statements.reduce<SiblingIfStatement[]>((siblingsArray, statement, currentIndex) => {
    const previousStatement = statements[currentIndex - 1];
    if (statement.type === "IfStatement" && !!previousStatement && previousStatement.type === "IfStatement") {
      return [{ first: previousStatement, following: statement }, ...siblingsArray];
    }
    return siblingsArray;
  }, []);
}

export = rule;
