# Cloud development

Use the existing isolated checkout at `/workspace/books-mysql`. Do not create a Git worktree unless explicitly requested.

The documented application is the static React/Vite frontend. The legacy `server` directory and MySQL are optional and are not needed for the learning platform.

Use Node.js 22 (as in Pages CI) and npm. From `/workspace/books-mysql/frontend`:

```sh
npm ci --no-audit --no-fund --cache /tmp/books-npm-cache
npm test
npm run lint
npm run typecheck
npm run build
npm run dev -- --host 127.0.0.1
```

The explicit temporary cache avoids depending on a writable home directory. Start the development process again after restoring a cloud snapshot. Check the local response and perform a browser smoke test; a running PID alone does not establish readiness. Build output is in ignored `frontend/dist`.

Preserve lesson identifiers and the `sysadmin-path-2026-progress` localStorage key. Do not clear user storage during setup. Dependency installation uses the frozen package lock; do not update lockfiles merely to silence package notices.

Browser regression and accessibility checks are available through `npm run test:e2e`. In this environment use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`; it builds the current application before starting its own preview server. On another machine install the matching browser with `npx playwright install --with-deps chromium` first. Test artifacts are ignored. `npm run build` now runs the Zod content validator automatically.
