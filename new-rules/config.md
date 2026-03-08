# Configuration

Rules for managing application configuration using Convict.

## Scope

Applies to all files in `src/config/`: schema definitions, environment JSON files, and any code that reads configuration values.

## File Structure

```
config/
├── config.js          # Schema definition and validation
├── development.json   # Development defaults
├── test.json          # Test defaults
└── production.json    # Production overrides (no default values)
```

## Core Principles

- All configuration values must come from environment variables.
- Production must fail on startup when required env vars are absent — no silent defaults.
- Validate early: call `config.validate()` immediately after schema definition, before any configuration is used.

## Must Have (Critical)

- **RULE-001:** Assign `default: null` and an `env` property to every schema property.
- **RULE-002:** Set defaults in environment JSON files (`test.json`, `development.json`) only; keep `production.json` empty of defaults.
- **RULE-003:** Call `config.validate({ allowed: 'strict' })` on startup before any configuration is used.
- **RULE-004:** Source all default values from environment JSON files — assign `default: null` in the schema itself.
- **RULE-005:** Name environment variables in `SCREAMING_SNAKE_CASE`.
- **RULE-006:** Throw an exception for all configuration errors so the application fails to start.

## Should Have (Important)

- **RULE-101:** Group related properties using nested schema objects.
- **RULE-102:** Write a descriptive `doc` property for each configuration field.
- **RULE-103:** Log all configuration keys (not values) on successful validation for debugging.
- **RULE-104:** Use Convict's built-in formats where applicable (`port`, `url`, `email`, `ipaddress`).
- **RULE-105:** Use custom `format` validation functions when built-in formats are insufficient.
