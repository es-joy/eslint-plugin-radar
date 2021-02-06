# CHANGES for `eslint-plugin-radar`

## 0.2.1

- License: Update license file name to reflect license type is specifically
  LGPL-3.0-only
- npm: Change `license` to non-deprecated SPDX identifier, `LGPL-3.0-only`
  as per:
  <https://github.com/SonarSource/eslint-plugin-sonarjs/issues/190>)

**Dev-focused:**

- Linting: Apply prettier to MD files and reapply latest to whole project
- npm: Revert back to using fixed rather than self-referential version of
  `eslint-plugin-radar` for self-linting (was adding to file space)

## 0.2.0

- Enhancement: add `meta.docs` (@Loxos)
- License: Rename file name to reflect license type (LGPL-3) and add extension
- Docs: Add `CHANGES.md`

**Dev-focused:**

- Travis: Check Node 15

## 0.1.0

- Forked from <https://github.com/SonarSource/eslint-plugin-sonarjs>
- License: Add headers to hidden files
- npm: Add ESLint 7 to peerDeps.
- npm: Bump engines to avoid EOL versions (Node >=10)
- npm: Use repository URL (accepted in npm, package.json linter doesn't
  complain, and allows IDEs to auto-open in browser (e.g., on cmd-O)
- npm: Add recommended/optional fields, author, contributors to satisfy linter

**Dev-focused:**

- Optimization: Add "use strict" for CJS eslint files
- Linting: Apply latest `prettier` (adding `.prettierignore` to avoid applying
  to test sources); apply latest `eslint-plugin-import`
- Linting: Check hidden files
- Linting: Check all files by default, ignoring test sources and lib
- Linting: Create separate ignore file for ruling (which lints nested
  `node_modules`)
- Testing: Ensure test-ci script runs (now that Node 8 is removed)
- Travis: Bump Node versions to 12 and 14
- Travis: Avoid comment about "nodejs 6" being cause of failure; the need
  for `jest-sonar-reporter` is due to it not being in devDeps.
- Properties: Point to non-deprecated `travis-ci.com`
- npm: Reorder scripts so main scripts at bottom; switch `test` to check
  coverage and add `jest` script for non-coverage testing
- npm: Add `.ncurc.js` file to prevent `npm-check-updates` auto-updating peerDeps.
- npm: Self-reference current version of sonarjs, so can apply latest linting
  to own repository
- npm: Update `lint-staged`, removing `git add`
- npm: Update devDeps.
- yarn: Upgrade
