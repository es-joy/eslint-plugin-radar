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
// https://jira.sonarsource.com/browse/RSPEC-3981

import { Rule } from "eslint";
import * as estree from "estree";
import { TSESTree } from "@typescript-eslint/experimental-utils";
import { isRequiredParserServices, RequiredParserServices } from "../utils/parser-services";

const CollectionLike = ["Array", "Map", "Set", "WeakMap", "WeakSet"];
const CollectionSizeLike = ["length", "size"];

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Collection sizes and array length comparisons should make sense",
      category: "Code Smell Detection",
      recommended: true,
      url: "https://github.com/es-joy/eslint-plugin-radar/blob/master/docs/rules/no-collection-size-mischeck.md",
    },
  },
  create(context: Rule.RuleContext) {
    const services = context.parserServices;
    const isTypeCheckerAvailable = isRequiredParserServices(services);
    return {
      BinaryExpression: (node: estree.Node) => {
        const expr = node as estree.BinaryExpression;
        if (["<", ">="].includes(expr.operator)) {
          const lhs = expr.left;
          const rhs = expr.right;
          if (isZeroLiteral(rhs) && lhs.type === "MemberExpression") {
            const { object, property } = lhs;
            if (
              property.type === "Identifier" &&
              CollectionSizeLike.includes(property.name) &&
              (!isTypeCheckerAvailable || isCollection(object, services))
            ) {
              context.report({
                message: `Fix this expression; ${property.name} of "${context
                  .getSourceCode()
                  .getText(object)}" is always greater or equal to zero.`,
                node,
              });
            }
          }
        }
      },
    };
  },
};

function isZeroLiteral(node: estree.Node) {
  return node.type === "Literal" && node.value === 0;
}

function isCollection(node: estree.Node, services: RequiredParserServices) {
  const checker = services.program.getTypeChecker();
  const tp = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node as TSESTree.Node));
  return !!tp.symbol && CollectionLike.includes(tp.symbol.name);
}

export = rule;
