import { body, noContent, parameter, ref, success } from "../openapi/generators.js";
import { group, resource, routeAuthenticated, tag } from "../openapi/paths.js";
import { schema } from "../typescript.js";

group("Channels");

//#region Channel Information
tag("Channel Information", "Query and fetch channels on Revolt");

const channelParams = {
    parameters: [
        await parameter('channel', 'Channel ID', ref("Id"))
    ]
}

resource('/channels/:channel', {
    get: routeAuthenticated(
        "Fetch Channel",
        "Retrieve a channel.",
        {
            ...channelParams,
            ...await success(
                "Retrieved channel.",
                ref("Channel")
            )
        }
    ),
    patch: routeAuthenticated(
        "Edit Channel",
        "Edit a channel object.",
        {
            ...channelParams,
            ...await body("Requested changes to channel object.", schema`
                import type { Status } from './Users';
                import type { AutumnId } from './_common';

                interface ${'EditChannel'} {
                    /**
                     * Channel name
                     * @minLength 1
                     * @maxLength 32
                     **/
                    name?: string;

                    /**
                     * Channel description
                     * @minLength 0
                     * @maxLength 1024
                     **/
                    description?: string;

                    icon?: AutumnId;

                    /**
                     * Whether this channel is not safe for work
                     */
                    nsfw?: boolean;

                    /**
                     * Field to remove from channel object
                     */
                    remove?: 'Icon' | 'Description';
                }
            `),
            ...await noContent("Succesfully changed channel object.")
        }
    ),
    delete: routeAuthenticated(
        "Close Channel",
        "Deletes a server channel, leaves a group or closes a DM.",
        {
            ...channelParams,
            ...await noContent("Deleted Channel")
        }
    )
});
//#endregion

//#region Channel Invites
tag("Channel Invites", "Create and manage invites for channels");

resource('/channels/:channel/invites', {
    post: routeAuthenticated(
        "Create Invite",
        "Creates an invite to this channel.\n\nChannel must be a `TextChannel`.",
        {
            ...channelParams,
            ...await success("Invite", schema`
                interface ${'InviteCode'} {
                    /**
                     * Invite Code
                     */
                    code: string;
                }
            `)
        }
    )
});
//#endregion

//#region Channel Permissions
tag("Channel Permissions", "Manage permissions for channels");

const roleParams = {
    parameters: [
        await parameter('channel', 'Channel ID', ref("Id")),
        await parameter('role', 'Role ID', ref("Id"))
    ]
}

const channelPermissions = await body("Channel Permissions", schema`
    interface ${'ChannelPermissions'} {
        permissions: number
    }
`)

resource('/channels/:channel/permissions/:role', {
    put: routeAuthenticated(
        "Set Role Permission",
        "Sets permissions for the specified role in this channel.\n\nChannel must be a `TextChannel` or `VoiceChannel`.",
        {
            ...roleParams,
            ...channelPermissions,
            ...await noContent("Successfully updated permissions.")
        }
    )
});

resource('/channels/:channel/permissions/default', {
    put: routeAuthenticated(
        "Set Default Permission",
        "Sets permissions for the default role in this channel.\n\nChannel must be a `Group`, `TextChannel` or `VoiceChannel`.",
        {
            ...channelParams,
            ...channelPermissions,
            ...await noContent("Successfully updated permissions.")
        }
    )
});
//#endregion

//#region Messaging
tag("Messaging", "Send and manipulate messages");

const messageParams = {
    parameters: [
        await parameter('channel', 'Channel ID', ref("Id")),
        await parameter('message', 'Message ID', ref("Id"))
    ]
}

const retrievedMessages = await success("Message array or object with requested data.", schema`
    import { Message } from './Channels';
    import { User } from './Users';
    import { Member } from './Servers';

    type ${'RetrievedMessages'} = Message[] | {
        messages: Message[],
        users: User[],
        members?: Member[]
    }
`);

resource('/channels/:channel/messages', {
    post: routeAuthenticated(
        "Send Message",
        "Sends a message to the given channel.",
        {
            ...channelParams,
            ...await body("Message to be sent.", schema`
                import type { Id, Nonce, AutumnId } from './_common';

                interface ${'SendMessage'} {
                    /**
                     * Message content to send.
                     * @minLength 0
                     * @maxLength 2000
                     */
                    content: string;

                    nonce: Nonce;

                    /**
                     * Attachments to include in message.
                     */
                    attachments?: AutumnId[];

                    /**
                     * Messages to reply to.
                     */
                    replies?: {
                        /**
                         * Message Id
                         */
                        id: Id;
                        
                        /**
                         * Whether this reply should mention the message's author.
                         */
                        mention: boolean;
                    }[]
                }
            `),
            ...await success(
                "Sent message.",
                ref("Message")
            )
        }
    ),
    get: routeAuthenticated(
        "Fetch Messages",
        "Fetches multiple messages.",
        {
            ...channelParams,
            ...await body("Fetch Options", schema`
                import { Id } from './_common';

                interface ${'FetchOptions'} {
                    /**
                     * Maximum number of messages to fetch.
                     * 
                     * For fetching nearby messages, this is \`(limit + 1)\`.
                     * 
                     * @minimum 1
                     * @maximum 100
                     */
                    limit?: number;

                    /**
                     * Message id before which messages should be fetched.
                     */
                    before?: Id;

                    /**
                     * Message id after which messages should be fetched.
                     */
                    after?: Id;

                    /**
                     * Message sort direction
                     */
                    sort: 'Latest' | 'Oldest';

                    /**
                     * Message id to fetch around, this will ignore 'before', 'after' and 'sort' options.
                     * Limits in each direction will be half of the specified limit.
                     * It also fetches the specified message ID.
                     */
                    nearby?: Id;

                    /**
                     * Whether to include user (and member, if server channel) objects.
                     */
                    include_users?: boolean;
                }
            `),
            ...retrievedMessages
        }
    )
});

resource('/channels/:channel/messages/:message', {
    get: routeAuthenticated(
        "Fetch Message",
        "Retrieves a message by ID.",
        {
            ...messageParams,
            ...await success(
                "Message",
                ref("Message")
            )
        }
    ),
    patch: routeAuthenticated(
        "Edit Message",
        "Edits a message that you've previously sent.",
        {
            ...messageParams,
            ...await body("Message edit data.", schema`
                interface ${'MessageEdit'} {
                    /**
                     * Message content
                     * @minLength 1
                     * @maxLength 2000
                     */
                    content: string;
                }
            `),
            ...await noContent("Message was changed.")
        }
    ),
    delete: routeAuthenticated(
        "Delete Message",
        "Delete a message you've sent or one you have permission to delete.",
        {
            ...messageParams,
            ...await noContent("Message was deleted.")
        }
    )
});

resource('/channels/:channel/messages/stale', {
    post: routeAuthenticated(
        "Poll Message Changes",
        "This route returns any changed message objects and tells you if any have been deleted.\n\nDon't actually poll this route, instead use this to update your local database.",
        {
            ...channelParams,
            ...await body("Poll Options", schema`
                import { Id } from './_common';

                interface ${'PollOptions'} {
                    /**
                     * Array of message IDs.
                     * 
                     * @maxItems 150
                     */
                    ids: Id[];
                }
            `),
            ...await success("Polled Information", schema`
                import { Message } from './Channels';

                interface ${'PolledInformation'} {
                    /**
                     * Changed message objects.
                     */
                    changed: Message[],

                    /**
                     * Array of deleted message IDs.
                     */
                    deleted: string[]
                }
            `)
        }
    )
});

resource('/channels/:channel/messages/search', {
    post: routeAuthenticated(
        "Search for Messages",
        "This route searches for messages within the given parameters.",
        {
            ...channelParams,
            ...await body("Search Options", schema`
                import { Id } from './_common';

                interface ${'SearchOptions'} {
                    /**
                     * Full-text search query.
                     * 
                     * See [MongoDB documentation](https://docs.mongodb.com/manual/text-search/#-text-operator) for more information.
                     * 
                     * @minLength 1
                     * @maxLength 64
                     */
                    query: string;

                    /**
                     * Maximum number of messages to fetch.
                     * 
                     * @minimum 1
                     * @maximum 100
                     */
                    limit?: number;

                    /**
                     * Message id before which messages should be fetched.
                     */
                    before?: Id;

                    /**
                     * Message id after which messages should be fetched.
                     */
                    after?: Id;

                    /**
                     * Message sort direction, by default it will be sorted by relevance.
                     */
                    sort?: 'Relevance' | 'Latest' | 'Oldest';

                    /**
                     * Whether to include user (and member, if server channel) objects.
                     */
                    include_users?: boolean;
                }
            `),
            ...retrievedMessages
        }
    )
});

resource('/channels/:channel/ack/:message', {
    put: routeAuthenticated(
        "Acknowledge Message",
        "Lets the server and all other clients know that we've seen this message id in this channel.",
        {
            ...messageParams,
            ...await noContent("Acknowledged message.")
        }
    )
});
//#endregion

//#region Groups
tag("Groups", "Create, invite users and manipulate groups");

resource('/channels/create', {
    post: routeAuthenticated(
        "Create Group",
        "Create a new group with friends.",
        {
            ...await body("Group Data", schema`
                import { Id, Nonce } from './_common';

                interface ${'GroupData'} {
                    /**
                     * Group name
                     * @minLength 1
                     * @maxLength 32
                     */
                    name: string;

                    /**
                     * Group description
                     * @minLength 0
                     * @maxLength 1024
                     */
                    description?: string;

                    nonce: Nonce;

                    /**
                     * Array of user IDs to add to the group.
                     * 
                     * Must be friends with them.
                     * 
                     * @maxItems 49
                     */
                    users?: string[];

                    /**
                     * Whether this group is not safe for work
                     */
                    nsfw?: boolean;
                }
            `),
            ...await success('Group', ref("GroupChannel"))
        }
    )
});

resource('/channels/:channel/members', {
    get: routeAuthenticated(
        "Fetch Group Members",
        "Retrieves users who are part of this group.",
        {
            ...messageParams,
            ...await success("Members", schema`
                import { User } from './Users';
                type ${'Members'} = User[];
            `)
        }
    ),
    put: routeAuthenticated(
        "Add Group Member",
        "Adds another user to the group.",
        {
            ...messageParams,
            ...await noContent("User was added to the group.")
        }
    ),
    delete: routeAuthenticated(
        "Remove Group Member",
        "Removes a user from the group.",
        {
            ...messageParams,
            ...await noContent("User was removed from the group.")
        }
    )
});
//#endregion

//#region Voice
tag("Voice", "Join and talk with other users");

resource('/channels/:channel/join_call', {
    post: routeAuthenticated(
        "Join Call",
        "Asks the voice server for a token to join the call.",
        {
            ...channelParams,
            ...await success("Join Data", schema`
                interface ${'JoinData'} {
                    /**
                     * Voso Token
                     */
                    token: string;
                }
            `)
        }
    )
});
//#endregion
