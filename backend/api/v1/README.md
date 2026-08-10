# API v1

This directory is the API composition boundary for StitchVerse v1.

Existing domain implementations remain under `backend/apps/`. Routes should be introduced here only when a domain needs an explicit versioned API boundary. Do not duplicate business logic here; delegate to domain services/selectors.
