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
import { RuleTester } from "eslint";
import rule = require("../../src/rules/max-switch-cases");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });

ruleTester.run("max-switch-cases", rule, {
  valid: [
    {
      code: `switch(i) {
      case 1:
        f();
      case 2:
        g();
    }`,
    },
    // default branch is excluded
    {
      code: `switch(i) {
      case 1:
        f();
      case 2:
        g();
      default:
        console.log("foo");
    }`,
      options: [2],
    },
    // empty branches are not counted
    {
      code: `switch(i) {
      case 1:
      case 2:
        g();
      case 3:
        console.log("foo");
    }`,
      options: [2],
    },
    // empty switch statement
    {
      code: `switch(i) {}`,
    },
  ],
  invalid: [
    {
      code: `switch(i) {
        case 1:
          f();
        case 2:
          g();
      }`,
      options: [1],
      errors: [
        {
          message: message(2, 1),
          line: 1,
          endLine: 1,
          column: 1,
          endColumn: 7,
        },
      ],
    },
  ],
});

function message(numSwitchCases: number, maxSwitchCases: number) {
  return `Reduce the number of non-empty switch cases from ${numSwitchCases} to at most ${maxSwitchCases}.`;
}
