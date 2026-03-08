# Naming

Intention-revealing naming conventions for all identifiers in this codebase.

## Scope

Applies to all files: function names, variables, constants, directories, modules, and exports.

## Must Have (Critical)

- **RULE-001:** Name every module and directory with a domain-specific term that reveals its purpose (e.g., `authentication/`, `user-notifications/`) — generic names like `utils`, `helpers`, `shared`, `common`, or `lib` are forbidden.
- **RULE-002:** Use domain-specific terms for directory names (e.g., `authentication/`, `user-notifications/`).
- **RULE-003:** Name functions as verbs or verb phrases (e.g., `validateUserCredentials()`, `calculateShippingCost()`).
- **RULE-004:** Prefix booleans and boolean-returning functions with `is`, `has`, `can`, or `should` (e.g., `isAuthenticated`, `hasPermission`).
- **RULE-005:** Name constants in `SCREAMING_SNAKE_CASE` describing what they represent, not their value (e.g., `MAX_LOGIN_ATTEMPTS`, not `FIVE`).

## Should Have (Important)

- **RULE-101:** Match module export names to their filename.
- **RULE-102:** Indicate async nature in function names when not obvious from context (e.g., `fetchUserData()`, `loadConfiguration()`).
- **RULE-103:** Include `Error` in the name of error classes and error variables (e.g., `ValidationError`).
- **RULE-104:** Name config files to indicate their environment or purpose (e.g., `database.config.js`).

## Could Have (Preferred)

- **RULE-201:** Apply consistent naming patterns within a domain — if you have `createUser()`, use `createOrder()` not `makeOrder()`.
- **RULE-202:** Choose longer descriptive names over abbreviations.
- **RULE-203:** Group related functionality with consistent prefixes (e.g., `user-creation/`, `user-authentication/`).
- **RULE-204:** Name events to indicate when they occur (e.g., `user.created`, `payment.processed`).
- **RULE-205:** Name middleware functions to describe their action (e.g., `requireAuthentication`, `validateRequestBody`).
