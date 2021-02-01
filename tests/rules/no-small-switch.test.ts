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
import rule = require("../../src/rules/no-small-switch");

const ruleTester = new RuleTester();

ruleTester.run("no-small-switch", rule, {
  valid: [
    { code: "switch (a) { case 1: case 2: break; default: doSomething(); break; }" },
    { code: "switch (a) { case 1: break; default: doSomething(); break; case 2: }" },
    { code: "switch (a) { case 1: break; case 2: }" },
  ],
  invalid: [
    {
      code: "switch (a) { case 1: doSomething(); break; default: doSomething(); }",
      errors: [{ message: '"switch" statements should have at least 3 "case" clauses', column: 1, endColumn: 7 }],
    },
    {
      code: "switch (a) { case 1: break; }",
      errors: 1,
    },
    {
      code: "switch (a) {}",
      errors: 1,
    },
  ],
});
