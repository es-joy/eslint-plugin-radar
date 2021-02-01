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
import * as fs from "fs";

const outputPath = process.argv[2];

const meta = [];

const readmeContent = fs.readFileSync("README.md", "utf-8");

const lines = readmeContent.split(/\n/);
let beforeBug: "before-bug";
let codeSmell: "code-smell";
let state: beforeBug | "bug" | "between" | codeSmell = beforeBug;
for (const line of lines) {
  if (state === "before-bug" && line.startsWith("*")) {
    state = "bug";
  }

  if (state === "bug") {
    if (line.startsWith("*")) {
      addRule(line, "BUG");
    } else {
      state = "between";
    }
  }

  if (state === "between" && line.startsWith("*")) {
    state = codeSmell;
  }

  if (state === codeSmell) {
    if (line.startsWith("*")) {
      addRule(line, "CODE_SMELL");
    } else {
      break;
    }
  }
}

function addRule(line: string, type: string) {
  const name = line.substr(2).split("([")[0].trim();
  const key = "radar/" + line.split("`")[1].trim();

  meta.push({
    key,
    name,
    type,
    description: `See description of ESLint rule <code>radar/${key}</code> at the <a href="https://github.com/es-joy/eslint-plugin-radar/blob/master/docs/rules/${key}.md">eslint-plugin-radar website</a>.`,
  });
}

fs.writeFileSync(outputPath, JSON.stringify(meta));
