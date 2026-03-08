# Single Responsibility Principle

Rules ensuring each module, class, and function has exactly one reason to change.

## Scope

Applies to all JavaScript modules, classes, functions, and components in `src/`.

## Core Principles

- **One reason to change:** Each module is responsible for one cohesive set of functionality.
- **High cohesion:** Elements within a module work together toward a single purpose.
- **Clear boundaries:** Express a module's responsibility in one sentence — if it requires "and" or "or", split it.

## Must Have (Critical)

- **RULE-001:** Separate business logic from infrastructure concerns — each module handles one or the other, not both.
- **RULE-002:** Split any class or module whose name requires "And", "Or", or "Manager" — each name must express a single purpose.
- **RULE-003:** Limit each function's side effects to those that directly serve its declared purpose.
- **RULE-004:** Assign data transformation and data persistence to separate modules.
- **RULE-005:** Keep UI components as presentation only — move business logic and data fetching to separate modules.

## Should Have (Important)

- **RULE-101:** Write functions of 5–20 lines — longer functions often indicate multiple responsibilities.
- **RULE-102:** Limit modules to 5–7 public exports — more suggests multiple concerns.
- **RULE-103:** Keep dependencies flowing one direction — circular dependencies indicate shared responsibilities that need extraction.
- **RULE-104:** Write each module to be testable in isolation without mocking unrelated systems.
- **RULE-105:** Handle errors in dedicated middleware or error modules, separate from business logic.

## Could Have (Preferred)

- **RULE-201:** Prefer many focused modules over fewer large ones.
- **RULE-202:** Use the facade pattern when coordinating multiple single-purpose modules.
- **RULE-203:** Use composition over inheritance to enable complex behaviour while maintaining SRP.

## Example

```javascript
// ✅ Good: three separate, focused modules
class UserValidator { validateEmail(email) { ... } }
class UserRepository { async save(user) { ... } }
class UserNotificationService { async sendWelcomeEmail(user) { ... } }

// ❌ Bad: one class doing too many things
class UserManager {
  validateUser() { ... }     // validation
  async saveUser() { ... }   // persistence
  async notifyUser() { ... } // notification
  async logActivity() { ... } // logging
}
```
