# Repository Structure

## Backend

`backend/apps/` contains the existing business domains. `backend/api/v1/` is the stable API composition boundary. `backend/core/` contains cross-cutting infrastructure only.

## Frontend

`frontend/src/features/` contains business-facing feature modules. `frontend/src/components/` is reserved for reusable UI primitives and layouts. `frontend/src/services/` contains integration boundaries such as HTTP clients. `frontend/src/app/` owns application bootstrap and providers.

## Infrastructure

`infrastructure/` contains container, compose, reverse-proxy, and environment examples. It must not contain application business logic.

## Migration policy

Do not mass-move existing files. Introduce new boundaries first, migrate imports and tests incrementally, then remove obsolete locations only after verification.
