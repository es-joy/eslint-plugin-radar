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
// https://jira.sonarsource.com/browse/RSPEC-1764

import { Rule } from "eslint";
import { Node, BinaryExpression, LogicalExpression } from "estree";
import { isIdentifier, isLiteral } from "../utils/nodes";
import { areEquivalent } from "../utils/equivalence";
import { report, issueLocation, IssueLocation } from "../utils/locations";

const EQUALITY_OPERATOR_TOKEN_KINDS = new Set(["==", "===", "!=", "!=="]);

// consider only binary expressions with these operators
const RELEVANT_OPERATOR_TOKEN_KINDS = new Set(["&&", "||", "/", "-", "<<", ">>", "<", "<=", ">", ">="]);

const message = (operator: string) =>
  `Correct one of the identical sub-expressions on both sides of operator "${operator}"`;

function hasRelevantOperator(node: BinaryExpression | LogicalExpression) {
  return (
    RELEVANT_OPERATOR_TOKEN_KINDS.has(node.operator) ||
    (EQUALITY_OPERATOR_TOKEN_KINDS.has(node.operator) && !hasIdentifierOperands(node))
  );
}

function hasIdentifierOperands(node: BinaryExpression | LogicalExpression) {
  return isIdentifier(node.left) && isIdentifier(node.right);
}

function isOneOntoOneShifting(node: BinaryExpression | LogicalExpression) {
  return node.operator === "<<" && isLiteral(node.left) && node.left.value === 1;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Identical expressions should not be used on both sides of a binary operator",
      category: "Bug Detection",
      recommended: true,
      url: "https://github.com/es-joy/eslint-plugin-radar/blob/master/docs/rules/no-identical-expressions.md",
    },
    schema: [
      {
        // internal parameter
        enum: ["radar-runtime"],
      },
    ],
  },
  create(context: Rule.RuleContext) {
    return {
      LogicalExpression(node: Node) {
        check(node as LogicalExpression);
      },
      BinaryExpression(node: Node) {
        check(node as BinaryExpression);
      },
    };

    function check(expr: BinaryExpression | LogicalExpression) {
      if (
        hasRelevantOperator(expr) &&
        !isOneOntoOneShifting(expr) &&
        areEquivalent(expr.left, expr.right, context.getSourceCode())
      ) {
        const secondaryLocations: IssueLocation[] = [];
        if (expr.left.loc) {
          secondaryLocations.push(issueLocation(expr.left.loc));
        }
        report(
          context,
          {
            message: message(expr.operator),
            node: isRadarRuntime() ? expr.right : expr,
          },
          secondaryLocations,
        );
      }
    }

    function isRadarRuntime() {
      return context.options[context.options.length - 1] === "radar-runtime";
    }
  },
};

export = rule;
