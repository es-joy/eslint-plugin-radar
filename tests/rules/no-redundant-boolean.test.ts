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
import rule = require("../../src/rules/no-redundant-boolean");

const ruleTester = new RuleTester();

ruleTester.run("no-redundant-boolean", rule, {
  valid: [
    { code: "a === false;" },
    { code: "a === true;" },
    { code: "a !== false;" },
    { code: "a !== true;" },
    { code: "a == foo(true);" },
    { code: "true < 0;" },
    { code: "~true;" },
    { code: "!foo;" },
    { code: "if (foo(mayBeSomething || false)) {}" },
    { code: "x ? y || false : z" },
  ],
  invalid: [
    {
      code: "if (x == true) {}",
      errors: [{ message: "Remove the unnecessary boolean literal.", column: 10, endColumn: 14 }],
    },
    { code: "if (x == false) {}", errors: 1 },
    { code: "if (x || false) {}", errors: 1 },
    { code: "if (x && false) {}", errors: 1 },

    { code: "x || false ? 1 : 2", errors: 1 },

    { code: "fn(!false)", errors: 1 },

    { code: "a == true == b;", errors: 1 },
    { code: "a == b == false;", errors: 1 },
    { code: "a == (true == b) == b;", errors: 1 },

    { code: "!(true);", errors: 1 },
    { code: "a == (false);", errors: 1 },

    { code: "true && a;", errors: 1 },
  ],
});
