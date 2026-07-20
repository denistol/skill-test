# Problem 2 — Backend Developer Challenge (Student CRUD)

## What Was Missing Initially

1. **`backend/src/modules/students/students-controller.js` contained only stubs.**  
   The handlers `handleGetAllStudents`, `handleAddStudent`, `handleUpdateStudent`, `handleGetStudentDetail`, and `handleStudentStatus` only had `//write your code`, so the API did not return data or perform CRUD operations.

2. **Response contracts must match what the frontend expects.**  
   For example, the student list endpoint is consumed via RTK Query and expects `{ students: [...] }`, not a raw array.

3. **Field name mapping between the frontend and repository differed.**  
   The frontend filters by the `class` query parameter, while the repository SQL filters use `className`. Without mapping, class filtering did not work correctly.

4. **The "Delete" operation required deletion logic, but the current database has no physical delete function for students.**  
   The schema and service already supported soft-disable via `is_active` (through the existing `setStudentStatus` method). Physical deletion would be risky due to foreign key relationships (e.g. `user_profiles`).

## Design Decisions

### 1) Controller layer: wiring services to HTTP responses

The controller was implemented to:
- call the existing service functions (`students-service.js`);
- normalize input from params/body/query into the expected format;
- return JSON in the shape the frontend actually uses.

### 2) `student_add_update` database function requirements

On update (`PUT /students/:id`), the frontend passes `id` in the URL and student fields in the body.  
Inside the Postgres `student_add_update` function, the update operation is determined by the presence of **`userId` in the JSON payload**:
- add: `data->>'userId'` is missing (or null)
- update: `data->>'userId'` is present

Therefore, in `handleUpdateStudent` the mapping is:
- `req.params.id` → `payload.userId`

### 3) `class` vs `className` for list filtering

The student list is filtered via query parameters. The repository uses `className`, while the frontend sends `class`.

In `handleGetAllStudents`:
- `className = req.query.className || req.query.class`

Then passed to the service as:  
`getAllStudents({ name, className, section, roll })`.

### 4) UI field alignment (adding `role`)

The student repository SQL filters by `role_id = 3`, but the list result does not include a `role` field.  
The student list UI displays a `role` column.

To avoid changing the repository layer (and reduce the risk of breaking SQL), the controller adds:
- `role: ROLE_NAMES.STUDENT` for each list item, where `ROLE_NAMES` is defined in `backend/src/constants/role-names.js`.

### 5) "Delete" implemented as soft-disable

The router previously had no `DELETE /students/:id`, even though the challenge expected full CRUD including deletion.

Since the current database deactivates users via `is_active` and `setStudentStatus` (recording `status_last_reviewed_dt` and `status_last_reviewer_id`), the following was added:
- `DELETE /students/:id` → calls `setStudentStatus(..., status: false)`

This matches the intent of "deletion" (the student becomes inactive) while preserving foreign key integrity.

### 6) Reviewer and `status` typing

For status change operations (`POST /students/:id/status` and `DELETE /students/:id`):
- `reviewerId = req.user.id` (current user from the JWT context);
- `status: Boolean(req.body.status)` (coerce to boolean even if the client sends a string or number).

## What Was Implemented

Changes for Problem 2:

1. **CRUD handlers completed in** `backend/src/modules/students/students-controller.js`:
   - `GET /api/v1/students` — `handleGetAllStudents`
   - `POST /api/v1/students` — `handleAddStudent`
   - `GET /api/v1/students/:id` — `handleGetStudentDetail`
   - `PUT /api/v1/students/:id` — `handleUpdateStudent`
   - `POST /api/v1/students/:id/status` — `handleStudentStatus` (enable/disable)

2. **Delete endpoint added in** `backend/src/modules/students/sudents-router.js`:
   - `DELETE /api/v1/students/:id` — `handleDeleteStudent` (soft-disable via `setStudentStatus`)

## How This Meets the `Readme.md` Expectations

- Full student CRUD now has HTTP handlers and correct responses.
- Errors and failure cases are handled in services via `ApiError`, and controllers invoke them through `express-async-handler`.
- The API contract (JSON format and fields required by the frontend) is aligned at the controller layer.
