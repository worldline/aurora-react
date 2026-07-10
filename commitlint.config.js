export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Casing is a style preference, not part of the Conventional Commits spec,
    // and semantic-release does not use it to compute version bumps. Disabled
    // to avoid inconsistent enforcement between feature-branch commits and
    // the squash-merge commit (whose message is the MR title, and is not
    // linted before merge). Structure (type/scope/description) is still enforced.
    'subject-case': [0],
  },
  ignores: [
    // Auto-generated merge and revert commits do not follow conventional format
    (/** @type {string} */ commit) => commit.startsWith('Merge '),
    (/** @type {string} */ commit) => commit.startsWith('Revert '),
  ],
}
