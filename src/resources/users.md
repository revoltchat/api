# Data Structures

## RelationshipStatus (enum)
+ None
+ User
+ Friend
+ Outgoing
+ Incoming
+ Blocked
+ BlockedOther

## Relationship (object)
:[_id](../fields/_id.md)
+ status (RelationshipStatus, required) - Explain in TODO.

## Presence (enum)
+ Online
+ Idle
+ Busy
+ Invisible

## UserStatus (object)
+ text (string)
+ presence (Presence)

## User (object)
:[_id](../fields/_id.md)
+ username: insert (string, required)
+ avatar (File) 
+ relations (array[Relationship])
+ badges (number) - This is a bitfield, see TODO.
+ status (UserStatus) - User's status and presence.
+ relationship (RelationshipStatus, required) - Explain in TODO.
+ online (boolean)



# Group Users

### Fetch User [GET /users/{id}]
Fetch a user by their ID.

+ Parameters
    + id - User ID

+ Request
    :[rAuth](../auth/headers.md)

+ Response 200 (application/json)
    + Attributes (User)

### Edit User [PATCH /users/@me]
Edit your user object.

+ Request (application/json)

    + Attributes
        + status (UserStatus)
        + profile (object)
            + content (string) - Profile content, has a maximum length of 2000.
            + background (string) - TODO
        + avatar (string) - TODO
        + remove (enum)
            + ProfileContent
            + ProfileBackground
            + StatusText
            + Avatar

    :[rAuth](../auth/headers.md)

+ Response 200

### Change Username [PATCH /users/@me/username]
Change your username.

+ Request (application/json)

    + Attributes
        + username (string)
        + password (string)

    + Schema

        {
            :[schema](../schema/$schema.md),
            "type": "object",
            "properties": {
                :[username](../schema/username.md),
                :[password](../schema/password.md)
            }
        }

    :[rAuth](../auth/headers.md)

+ Response 200

### Fetch profile [GET /users/{id}/profile]
Returns a user's profile.

Requires `ViewProfile`.

+ Parameters
    + id - User ID

+ Response 200 (image/png)

### Fetch default avatar [GET /users/{id}/default_avatar]
Returns a default avatar based on given id.

+ Parameters
    + id - User ID

+ Response 200 (image/png)
