# StitchVerse 2.0 — Professional Architecture

This branch introduces the production-oriented repository boundaries for StitchVerse without changing existing runtime contracts.

## Current safety model

The existing Django apps, settings paths, migrations, React entry points, routes, and feature implementations are intentionally preserved. New directories are additive foundations.

## Target shape

```text
StitchVerse-2.0/
├── .github/
├── backend/
│   ├── apps/          # existing domain applications
│   ├── api/v1/        # versioned API composition boundary
│   ├── config/        # Django configuration
│   ├── core/          # cross-cutting infrastructure
│   ├── requirements/
│   └── tests/
├── frontend/
│   ├── src/app/       # application bootstrap
│   ├── src/features/  # domain-oriented UI
│   ├── src/components/# reusable UI
│   ├── src/services/  # external integrations
│   ├── src/hooks/
│   ├── src/lib/
│   ├── src/utils/
│   └── tests/
├── infrastructure/
├── docs/
├── scripts/
├── tools/
└── tests/             # cross-stack/e2e tests
```

## Migration rule

Structural improvements must be incremental. Do not rename business domains, move Django models, change migration packages, or rewrite frontend routes simply to make the tree look cleaner. Every migration must preserve behavior and be validated before cleanup.
