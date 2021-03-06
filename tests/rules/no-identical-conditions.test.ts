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
import rule = require("../../src/rules/no-identical-conditions");

const ruleTester = new RuleTester();

const message = (line: number) => `This branch duplicates the one on line ${line}`;

ruleTester.run("no-identical-conditions", rule, {
  valid: [
    {
      code: "if (a) {} else if (b) {}",
    },
    {
      code: "if (a) {} else {}",
    },
  ],
  invalid: [
    {
      code: `
        if (a) {}
        else if (a) {}
      `,
      errors: [{ message: message(2), line: 3, column: 18, endColumn: 19 }],
    },
    {
      code: `
        if (a) {}
        //  ^>
        else if (a) {}
        //       ^
      `,
      options: ["radar-runtime"],
      errors: [
        JSON.stringify({
          secondaryLocations: [
            {
              line: 2,
              column: 12,
              endLine: 2,
              endColumn: 13,
              message: "Original",
            },
          ],
          message: message(2),
        }),
      ],
    },
    {
      code: `
        if (b) {}
        else if (a) {}
        else if (a) {}
      `,
      errors: [{ message: message(3), line: 4, column: 18, endColumn: 19 }],
    },
    {
      code: `
        if (a) {}
        else if (b) {}
        else if (a) {}
      `,
      errors: [{ message: message(2), line: 4, column: 18, endColumn: 19 }],
    },
  ],
});
