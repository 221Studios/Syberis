# Contributing

## Before opening a pull request

Install the lockfile dependencies with `npm ci`, then run:

```bash
npm run format:check
npm run lint
npm test
npm run build
```

Keep kennel and litter content in `src/data/kennel.js`. Add tests when changing data helpers, contact formatting, or litter behavior. Avoid committing secrets, generated `.next` output, or original high-resolution photo dumps.

## Commit messages

Write commit messages in English using the Conventional Commits format:

```text
feat: add litter availability details
fix: keep menu scroll locked while open
docs: explain local setup
refactor: centralize contact link formatting
```

Use a short imperative summary and keep each commit focused on one change.
