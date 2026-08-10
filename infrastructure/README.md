# Infrastructure

Deployment and local-runtime concerns belong here. Application code must remain in `backend/` and `frontend/`.

Planned boundaries:

- `compose/` — Docker Compose definitions.
- `docker/` — service-specific Dockerfiles and runtime configuration.
- `env/` — committed environment templates only; never secrets.
