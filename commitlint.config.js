export default {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    // Auto-generated merge and revert commits do not follow conventional format
    (/** @type {string} */ commit) => commit.startsWith('Merge '),
    (/** @type {string} */ commit) => commit.startsWith('Revert '),
  ],
}
