# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the yoohoo.guru platform.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## ADR Format

Each ADR follows this structure:

- **Title**: Brief description of the decision
- **Status**: proposed | accepted | deprecated | superseded
- **Context**: What is the issue we're seeing that is motivating this decision?
- **Decision**: What is the change we're proposing?
- **Consequences**: What becomes easier or more difficult because of this change?

## Index of ADRs

- [ADR-0001: API Versioning Strategy](./0001-api-versioning.md)
- [ADR-0002: Request ID Tracking](./0002-request-id-tracking.md)
- [ADR-0003: Monorepo Architecture](./0003-monorepo-architecture.md)
- [ADR-0004: Frontend Logger Utility](./0004-frontend-logger.md)

## Creating a New ADR

1. Copy the template: `cp template.md 000X-title.md`
2. Fill in the sections
3. Submit for review
4. Update the index above when accepted
