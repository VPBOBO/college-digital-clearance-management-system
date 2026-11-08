# Staff Web Portal

React + Vite office reviewer interface. Start the Express backend first, then run:

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`. The development server proxies `/api` to `http://127.0.0.1:3000`.

## Production build and preview

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

Vite preview normally listens at `http://127.0.0.1:4173`. The backend must allow the exact preview origin through `WEB_ORIGINS`; the supplied backend `.env.example` includes the standard loopback development and preview origins. If you change `WEB_ORIGINS`, restart the backend.

The first slice supports Administrative Office Personnel accounts only. Review items are scoped to each user's active office assignment. The administrator configuration interface and instructor processing are deferred.

The owner-provided 2026-11-08 evidence records a successful production build, production preview, reviewer sign-in, and office-scoped filters. See `docs/implementation/BUILD_AND_TEST_STATUS_2026-11-08.md` for evidence qualifications.
