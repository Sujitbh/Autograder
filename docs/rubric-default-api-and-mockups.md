# Course default rubric — API, schema, validation, UX notes

This document accompanies the implementation of course-level default rubrics, assignment rubric replacement, and the Autograder UI entry points.

## JSON schema (course default rubric document)

Stored in `courses.default_rubric_json` and returned by `GET /api/courses/{course_id}/default-rubric`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "CourseDefaultRubric",
  "type": "object",
  "required": ["rubricMode", "weightPolicy", "pointBudget", "sections", "autoNormalize"],
  "properties": {
    "rubricMode": { "enum": ["weighted", "unweighted"] },
    "weightPolicy": { "enum": ["percent", "points"] },
    "pointBudget": { "type": "number", "exclusiveMinimum": 0, "maximum": 10000 },
    "autoNormalize": { "type": "boolean" },
    "sections": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["name", "weight", "criteria"],
        "properties": {
          "name": { "type": "string", "minLength": 1 },
          "description": { "type": "string" },
          "weight": { "type": "number", "minimum": 0, "maximum": 1000 },
          "criteria": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object",
              "required": ["name", "maxPoints", "weight", "gradingMethod"],
              "properties": {
                "name": { "type": "string", "minLength": 1 },
                "description": { "type": "string" },
                "maxPoints": { "type": "integer", "minimum": -1000, "maximum": 1000 },
                "weight": { "type": "number", "minimum": 0, "maximum": 1000 },
                "gradingMethod": { "enum": ["auto", "manual", "hybrid"] }
              }
            }
          }
        }
      }
    }
  }
}
```

**Semantics**

- **`weightPolicy: percent`**: section `weight` values are percentages of the grade and must sum to **100** (server may auto-scale when `autoNormalize` is true).
- **`weightPolicy: points`**: section `weight` values are points and must sum to **`pointBudget`** (auto-scale similarly).
- **Criterion `weight`**: global share of the total grade (percent points on the 0–100 assignment scale), consistent with the Create Assignment wizard. Within each section, criterion weights should sum to that section’s weight.

## API endpoints

| Method | Path | Who | Description |
|--------|------|-----|-------------|
| `GET` | `/api/courses/{course_id}/default-rubric` | Course **instructor** or **TA** | Returns saved JSON or the built-in professor template (Content 40%, Organization 20%, Research/Evidence 20%, Mechanics 10%, Participation/Timeliness 10%). Includes `isBuiltin`, `updatedAt`, `updatedByName` when persisted. |
| `PUT` | `/api/courses/{course_id}/default-rubric` | **Faculty** + course **instructor** enrollment (admin bypass) | Validates and normalizes weights; stores JSON; sets `default_rubric_updated_at` and `default_rubric_updated_by_id`. |
| `POST` | `/api/assignments/{assignment_id}/rubric` | Course **instructor**, or **TA** with `can_edit_rubrics` | Replaces all `rubric_sections` / criteria. Validates weighted sums (sections → 100; criteria per section → section weight). |

## Example requests

**PUT course default (trimmed)**

```http
PUT /api/courses/12/default-rubric
Content-Type: application/json
```

```json
{
  "rubricMode": "weighted",
  "weightPolicy": "percent",
  "pointBudget": 100,
  "autoNormalize": true,
  "sections": [
    {
      "name": "Content",
      "description": "Depth and accuracy",
      "weight": 40,
      "criteria": [
        {
          "name": "Overall content",
          "description": "",
          "maxPoints": 40,
          "weight": 40,
          "gradingMethod": "manual"
        }
      ]
    }
  ]
}
```

**POST assignment rubric**

```http
POST /api/assignments/99/rubric
Content-Type: application/json
```

```json
{
  "rubricMode": "weighted",
  "rubric": [
    {
      "name": "Content",
      "description": "",
      "weight": 40,
      "criteria": [
        {
          "name": "Quality",
          "description": "",
          "maxPoints": 40,
          "weight": 40,
          "gradingMethod": "manual"
        }
      ]
    }
  ]
}
```

## Validation and error shapes

- **422 Unprocessable Entity** (FastAPI / Pydantic): `{ "detail": [ { "loc": [...], "msg": "...", "type": "..." } ], "body": "..." }`
- **400 Bad Request** (business rules): `{ "detail": "Percent section weights must sum to 100; got 92.00" }`
- **403 Forbidden**: `{ "detail": "Forbidden: course instructor or TA with rubric edit permission required" }` (assignment rubric)

## UI wireframes (textual)

### Desktop — default rubric editor

- **Header**: title, last-updated line, primary **Save as default**, secondary **Reload**.
- **Toolbar card**: weight style (Percent | Points), numeric budget, rubric mode, live **section sum / target** indicator (green vs amber).
- **Section list**: each row = drag handle (mouse), **Move up / down** (keyboard + SR labels), section title, weight, description, nested criteria grid (name, max pts, global weight), add/remove criterion, remove section.
- **Preview card**: per-criterion sample % earned → example final out of max.

### Mobile (narrow)

- Same vertical stack; section cards full width; drag handle optional on touch (reorder via up/down only); criteria stack in one column; preview below fold.

## Frontend routes

- `/courses/[courseId]/default-rubric` — full editor (`CourseDefaultRubricEditor`).
- Course **Settings** → sidebar **Default Rubric** — short explanation + link to editor.
- **Create Assignment** — loads GET default into the form; **Reset to default**, **Save as default** (faculty/admin), **Save for this assignment** (explains publish/draft behavior).
