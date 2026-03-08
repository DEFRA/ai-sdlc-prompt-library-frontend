# Logging

Rules for structured logging using the custom Pino-based logger wrapper.

## Scope

Applies to all server-side code in `src/server/`. Client-side code does not use this logger.

## Core Principles

- **Security first:** When uncertain whether data is safe to log, exclude it.
- **Structured logs:** All logs must be machine-parseable JSON (Pino default).
- **Contextual:** Logs must trace request flow without requiring code inspection.
- **Correlated:** Every log entry must be traceable to its originating request via correlation IDs.

## Must Have (Critical)

- **RULE-001:** Use `createLogger()` from `src/server/common/helpers/logging/logger.js` for all logging.
- **RULE-002:** Exclude bearer tokens, API keys, passwords, and authentication headers from all log entries.
- **RULE-003:** Exclude or sanitize PII (emails, SSNs, credit card numbers, phone numbers) from all log entries.
- **RULE-004:** Include correlation IDs (request ID, trace ID) in every log entry via child loggers.
- **RULE-005:** Log only status codes and durations for request/response — omit full bodies.
- **RULE-006:** Exclude database connection strings and credentials from all log entries.

## Should Have (Important)

- **RULE-101:** Log significant business logic decisions at `DEBUG` level with clear reasoning.
- **RULE-102:** Log all external API calls: initiation, response status, and duration — omit full payloads.
- **RULE-103:** Log failed authentication/authorisation attempts at `WARN` level with sanitized identifiers.
- **RULE-104:** Log HTTP requests with: method, path, status code, and response time.
- **RULE-105:** Log database queries exceeding 100ms.
- **RULE-106:** Check `logger.isLevelEnabled('debug')` before computing expensive values to be logged.
- **RULE-107:** Create one logger instance per module; use child loggers for request context — never inside loops or frequently called functions.

## Example

```javascript
// ✅ Good
const { createLogger } = require('src/server/common/helpers/logging/logger')
const logger = createLogger()

logger.info({ method: req.method, path: req.path, statusCode: res.statusCode }, 'Request completed')
logger.error({ err: error, requestId: 'req-123' }, 'API call failed')

const requestLogger = logger.child({ requestId: req.id, traceId: 'trace-abc' })
requestLogger.info('Processing request')

// ❌ Bad
const pino = require('pino')
const logger = pino()                                         // Bypasses our wrapper
logger.info(`User logged in with token: ${bearerToken}`)      // Sensitive data in log
logger.debug('Processing request ' + requestId)               // Not structured JSON
logger.error({ error: error.toString() }, 'Failed')           // Loses stack trace
```
