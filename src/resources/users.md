# Data Structures

## User (object)
:[_id](../fields/_id.md)
+ username: insert (string, required)
+ avatar (File)

# Group Users

### Fetch User [GET /users/{id}]
+ Parameters
    + id: - User ID

+ Request
    + Headers
            x-user-id: :[ULID](../templates/ulid.md)
            x-session-token: :[ULID](../templates/ulid.md)

+ Response 200 (application/json)
    + Attributes (User)

