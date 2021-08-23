import { body, noContent, parameter, ref, success } from "../openapi/generators.js";
import { group, resource, route, routeAuthenticated, tag } from "../openapi/paths.js";
import { schema } from "../typescript.js";

group("Miscellaneous");

//#region Invites
tag("Invites", "View, join and delete invites");

const inviteParams = {
    parameters: [
        await parameter("invite", "Invite Code", { type: 'string' })
    ]
}

resource('/invites/:invite', {
    get: routeAuthenticated(
        "Fetch Invite",
        "Fetch an invite by its ID.",
        {
            ...inviteParams,
            ...await success("Invite", ref("RetrievedInvite"))
        }
    ),
    post: routeAuthenticated(
        "Join Invite",
        "Join an invite by its ID.",
        {
            ...inviteParams,
            ...await success("Invite", schema`
                import { Channel } from './Channels';
                import { Server } from './Servers';

                interface ${'InviteData'} {
                    type: 'Server',
                    channel: Channel,
                    server: Server
                }
            `)
        }
    ),
    delete: routeAuthenticated(
        "Delete Invite",
        "Delete an invite by its ID.",
        {
            ...inviteParams,
            ...await noContent("Deleted invite.")
        }
    ),
});
//#endregion

//#region Sync
tag("Sync", "Upload and retrieve any JSON data between clients");

resource('/sync/settings/fetch', {
    post: routeAuthenticated(
        "Fetch Settings",
        "Fetch settings from server filtered by keys.\n\nThis will return an object with the requested keys, each value is a tuple of `(timestamp, value)`, the value is the previously uploaded data.",
        {
            ...await body("Options", schema`
                interface ${'FetchSettingsOptions'} {
                    /**
                     * Keys to fetch
                     */
                    keys: string[]
                }
            `),
            ...await success("Settings Data", schema`
                type ${'SettingsData'} = { [key: string]: [ number, string ] };
            `)
        }
    )
});

resource('/sync/settings/set', {
    post: routeAuthenticated(
        "Set Settings",
        "Upload data to save to settings.",
        {
            parameters: [
                {
                    name: 'timestamp',
                    in: 'query',
                    description: "Timestamp of settings change. Useful to prevent a feedback loop.",
                    schema: {
                        type: 'number'
                    }
                }
            ],
            ...await body("Settings Data", schema`
                interface ${'SetSettingsData'} {
                    [key: string]: string
                }
            `),
            ...await noContent("Successfully synced data.")
        }
    )
});

resource('/sync/unreads', {
    post: routeAuthenticated(
        "Fetch Unreads",
        "Fetch information about unread state on channels.",
        await success(
            "Array of Unreads Data",
            schema`
                import type { ChannelUnread } from "./Sync";
                type ${'FetchUnreads'} = ChannelUnread[];
            `
        )
    )
});
//#endregion

//#region Web Push
tag("Web Push", "Subscribe to and receive Revolt push notifications while offline");

resource('/push/subscribe', {
    post: routeAuthenticated(
        "Subscribe",
        "Create a new Web Push subscription.\n\nIf an existing subscription exists on this session, it will be removed.",
        {
            ...await body("Web Push Subscription", ref("WebPushSubscription")),
            ...await noContent("Subscribed successfully.")
        }
    )
});

resource('/push/unsubscribe', {
    post: routeAuthenticated(
        "Unsubscribe",
        "Remove the Web Push subscription associated with the current session.",
        await noContent("Unsubscribed successfully.")
    )
});
//#endregion
