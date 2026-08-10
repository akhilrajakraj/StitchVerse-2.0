# Backend Tests

Tests are organized conceptually as:

- `unit/` — isolated domain logic.
- `integration/` — Django/database/service integration.
- `api/` — endpoint and permission contracts.
- `fixtures/` — reusable test data.

Existing app-local tests remain valid and should be migrated only when there is a concrete benefit.
