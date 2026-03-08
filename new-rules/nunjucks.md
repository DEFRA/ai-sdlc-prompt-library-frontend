# Nunjucks

Rules for structuring and splitting Nunjucks templates and their data models.

## Scope

Applies to all Nunjucks templates (`*.njk`) and their associated model files (`*.model.js`).

## Data Binding

- Give every `.njk` file that requires data a corresponding `.model.js` file, named to match (e.g. `summary.njk` → `summary.model.js`).

## Section Splitting

- Split a Nunjucks template into section files when it renders more than one distinct UI section.
- Use `{% include %}` to compose sections into the parent template.

## File Structure

Each page gets a folder matching the parent template name:

```
thing.njk
view-components/
  summary.njk
  summary.model.js
  details.njk
  details.model.js
```

```nunjucks
{% include "view-components/summary.njk" %}
```

## Model Files

- Give each section that requires data a corresponding `*.model.js`.
- Define the exact data shape the template expects in the model.
- Write models as plain JavaScript classes with no external dependencies.
- Write only pure functions in model files — functions that map input data structures to output with no side effects.
- Document all property types with JSDoc.

## Example

```javascript
class ThingSummaryModel {
  /**
   * @param {Object} params
   * @param {string} params.title
   * @param {number} params.count
   * @param {boolean} params.isComplete
   */
  constructor({ title, count, isComplete }) {
    this.title = title
    this.count = count
    this.isComplete = isComplete
  }
}
```
