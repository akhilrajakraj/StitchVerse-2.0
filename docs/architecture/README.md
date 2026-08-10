# StitchVerse Architecture

StitchVerse is organized as a modular full-stack application with a Django backend and React frontend.

## Architecture principles

- Preserve existing application contracts while evolving structure.
- Domain-oriented backend apps.
- Feature-oriented frontend modules.
- Explicit API versioning under `backend/api/v1`.
- Shared infrastructure belongs outside business domains.
- New architectural layers are introduced additively before legacy files are migrated.
- No migration, URL, model, or import is relocated merely for cosmetic reasons.

## Migration rule

Existing `backend/apps/*` and `frontend/src/*` code remains operational during the architecture transition. Future refactors should migrate one bounded context at a time and verify imports, Django checks, migrations, frontend linting, and production builds after each migration.
