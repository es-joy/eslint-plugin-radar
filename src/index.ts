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
import { Linter } from "eslint";

const radarRules: [string, Linter.RuleLevel][] = [
  ["cognitive-complexity", "error"],
  ["max-switch-cases", "error"],
  ["no-all-duplicated-branches", "error"],
  ["no-collapsible-if", "error"],
  ["no-collection-size-mischeck", "error"],
  ["no-duplicate-string", "error"],
  ["no-duplicated-branches", "error"],
  ["no-element-overwrite", "error"],
  ["no-extra-arguments", "error"],
  ["no-identical-conditions", "error"],
  ["no-identical-functions", "error"],
  ["no-identical-expressions", "error"],
  ["no-inverted-boolean-check", "error"],
  ["no-one-iteration-loop", "error"],
  ["no-redundant-boolean", "error"],
  ["no-redundant-jump", "error"],
  ["no-same-line-conditional", "error"],
  ["no-small-switch", "error"],
  ["no-unused-collection", "error"],
  ["no-use-of-empty-return-value", "error"],
  ["no-useless-catch", "error"],
  ["prefer-immediate-return", "error"],
  ["prefer-object-literal", "error"],
  ["prefer-single-boolean-return", "error"],
  ["prefer-while", "error"],
];

const radarRuleModules: any = {};

const configs: { recommended: Linter.Config & { plugins: string[] } } = {
  recommended: { plugins: ["radar"], rules: {} },
};

radarRules.forEach((rule) => (radarRuleModules[rule[0]] = require(`./rules/${rule[0]}`)));
radarRules.forEach((rule) => (configs.recommended.rules![`radar/${rule[0]}`] = rule[1]));

export { radarRuleModules as rules, configs };
