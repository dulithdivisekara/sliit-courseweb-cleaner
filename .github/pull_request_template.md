## Summary
<!-- Provide a clear, concise summary of the change and the problem it solves. -->

## Type of Change
<!-- Mark the relevant options with an 'x' -->
- [ ] `feat`: New feature or user-facing enhancement
- [ ] `fix`: Bug fix or false-positive filter correction
- [ ] `rules`: Heuristic additions or adjustments in `rules.json`
- [ ] `style`: CSS, dark theme contrast, or visual layout improvements
- [ ] `refactor`: Internal code refactoring with no behavioral change
- [ ] `docs`: Documentation, wiki, or store copy updates
- [ ] `chore`: Build script, dependencies, or maintenance

## Affected Components
- [ ] Content Script (`src/extension-main.js` / `src/shared-core.js`)
- [ ] Side-Panel Drawer / Modal UI (`src/shared-styles.css`)
- [ ] Toolbar Action Popup (`src/popup.*`)
- [ ] Background Service Worker (`extension/service-worker.js`)
- [ ] Tampermonkey Userscript (`src/userscript-main.js`)
- [ ] Heuristics Dictionary (`rules.json`)
- [ ] Documentation / Landing Site

## Testing and Verification
- [ ] Executed `npm test` without errors.
- [ ] Ran `./build.sh` to compile extension and userscript distributions.
- [ ] Verified manually on [SLIIT Courseweb](https://courseweb.sliit.lk/) in at least one browser.
- [ ] Verified that no personally identifiable student data (PII) is included in code or screenshots.

## Related Issues
<!-- Reference any related issue(s): e.g., Closes #12, Fixes #34 -->
Closes #
