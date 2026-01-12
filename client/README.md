# Client (React)

Overview
- React frontend using ViewModel pattern (see `src/viewModels/`).
- API calls centralised in `src/services/api.js`.

Where to add features
- Add UI components to `src/components/`.
- Add or extend ViewModels in `src/viewModels/` to implement state and business logic.
- Add services (API wrappers) to `src/services/` and export functions used by viewModels.

Run
- Uses Vite. From repo root:

```bash
cd client
npm install
npm run dev
```
