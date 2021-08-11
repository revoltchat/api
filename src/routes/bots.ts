import { body, parameter, ref, success } from "../openapi/generators.js";
import { group, resource, routeAuthenticated, tag } from "../openapi/paths.js";
import { schema } from "../typescript.js";

group("Bots");

//#region Bots
tag("Bots", "Create and edit bots.");

resource('/bots/create', {
    post: routeAuthenticated(
        "Create Bot",
        "Create a new Revolt bot.",
        {
            ...await body("Bot Details", schema`
                interface ${'BotDetails'} {
                    /**
                     * Bot name
                     * @minLength 1
                     * @maxLength 32
                     **/
                    name: string;
                }
            `),
            ...await success(
                "Succesfully created a new bot.",
                ref("Bot")
            )
        }
    )
});

resource('/bots/@me', {
    get: routeAuthenticated(
        "Fetch Owned Bots",
        "Fetch all of your bots.",
        {
            ...await success("Array of bot objects.", schema`
                import type { Bot } from './Bots';
                type ${'MyBots'} = Bot[];
            `)
        }
    )
});

const botParams = {
    parameters: [
        await parameter('bot', 'Bot ID', ref("Id"))
    ]
}

resource('/bots/:bot', {
    get: routeAuthenticated(
        "Fetch Bot",
        "Fetch details of an owned bot.",
        {
            ...botParams,
            ...await success("Bot", ref("Bot"))
        }
    ),
    patch: routeAuthenticated(
        "Edit Bot",
        "Edit bot details.",
        {
            ...await body("Requested changes to bot object.", schema`
                interface ${'EditBot'} {
                    /**
                     * Channel name
                     * @minLength 1
                     * @maxLength 32
                     **/
                    name?: string;

                    /**
                     * Whether the bot can be added by anyone
                     **/
                    public?: boolean;

                    /**
                     * Interactions URL
                     * @minLength 1
                     * @maxLength 2048
                     **/
                    interactions_url?: string;

                    /**
                     * Field to remove from bot object
                     */
                    remove?: 'InteractionsURL';
                }
            `),
            ...await success("Succesfully changed bot object.")
        }
    ),
    delete: routeAuthenticated(
        "Delete Bot",
        "Delete a bot.",
        {
            ...botParams,
            ...await success("Deleted bot.")
        }
    )
});

resource('/bots/:bot/invite', {
    get: routeAuthenticated(
        "Fetch Public Bot",
        "Fetch details of a public (or owned) bot.",
        {
            ...botParams,
            ...await success("Public Bot", ref('PublicBot'))
        }
    ),
    post: routeAuthenticated(
        "Invite Public Bot",
        "Invite a bot to a server or group.",
        {
            ...botParams,
            ...await body("Information about where to invite the bot.", schema`
                import type { Id } from './_common';

                type ${'InvitePublicBot'} = (
                    {
                        /**
                         * Server ID to add the bot to.
                         */
                        server: Id
                    } | 
                    {
                        /**
                         * Group channel ID to add the bot to.
                         */
                        group: Id
                    }
                )
            `),
            ...await success("Added bot to server / group.")
        }
    )
});
//#endregion

//#region Human Interactions
//#endregion
