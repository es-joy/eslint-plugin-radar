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
import rule = require("../../src/rules/prefer-single-boolean-return");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });

ruleTester.run("prefer-single-boolean-return", rule, {
  valid: [
    {
      code: `
        function foo() {
          if (something) {
            return true;
          } else if (something) {
            return false;
          } else {
            return true;
          }
        }
      `,
    },
    {
      code: `
        function foo() {
          if (something) {
            return x;
          } else {
            return false;
          }
        }
      `,
    },
    {
      code: `
        function foo(y) {
          if (something) {
            return true;
          } else {
            return foo;
          }
        }
      `,
    },
    {
      code: `
        function foo() {
          if (something) {
            doSomething();
          } else {
            return true;
          }
        }
      `,
    },
    {
      code: `
        function foo() {
          if (something) {
            doSomething();
            return true;
          } else {
            return false;
          }
        }
      `,
    },
    {
      code: `
        function foo() {
          if (something) {
            return;
          } else {
            return true;
          }
        }
      `,
    },
    {
      code: `
        function foo() {
          if (something) {
            return true;
          }
        }
      `,
    },
    {
      code: `
        function foo() {
          if (something) {
            return foo(true);
          } else {
            return foo(false);
          }
        }
      `,
    },
    {
      code: `
        function foo() {
          if (something) {
            var x;
          } else {
            return false;
          }
        }
      `,
    },
    {
      code: `
        function foo() {
          if (something) {
            function f() {}
            return false;
          } else {
            return true;
          }
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        function foo() {
          if (something) {
            return true;
          } else {
            return false;
          }

          if (something) {
            return false;
          } else {
            return true;
          }

          if (something) return true;
          else return false;

          if (something) {
            return true;
          } else {
            return true;
          }
        }
      `,
      errors: [
        {
          message: "Replace this if-then-else statement by a single return statement.",
          line: 3,
          column: 11,
          endLine: 7,
          endColumn: 12,
        },
        { line: 9, column: 11, endLine: 13, endColumn: 12 },
        { line: 15, column: 11, endLine: 16, endColumn: 29 },
        { line: 18, column: 11, endLine: 22, endColumn: 12 },
      ],
    },
  ],
});
