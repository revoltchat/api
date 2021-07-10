# Data Structures

## SavedMessagesChannel (object)
:[_id](../fields/_id.md)
+ channel_type: SavedMessages (enum, required)
+ user (string, required)

## DirectMessageChannel (object)
:[_id](../fields/_id.md)
+ channel_type: DirectMessage (enum, required)
+ active (boolean, required)

# Group Channels

### Fetch Channel [GET /channels/{id}]
Fetch a channel by its ID.

+ Parameters
    + id - Channel ID

+ Request
    :[rAuth](../auth/headers.md)

+ Response 200 (application/json)
    + Attributes (enum[SavedMessagesChannel, DirectMessageChannel])
