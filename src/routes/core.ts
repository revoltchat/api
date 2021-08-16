import { group, resource, route, routeAuthenticated, tag } from "../openapi/paths.js";
import { body, noContent, ref, success } from "../openapi/generators.js";
import { schema } from "../typescript.js";

group("Chat Platform");

tag("Core", "Use in your applications to determine information about the Revolt node.");

resource('/', {
    get: route(
        "Query Node",
        "This returns information about which features are enabled on the remote node.",
        await success(
            "Server node information.",
            ref("RevoltConfiguration")
        )
    )
});

tag("Onboarding", "After signing up to Revolt, users must pick a unique username.");

resource('/onboard/hello', {
    get: routeAuthenticated(
        "Check Onboarding Status",
        "This will tell you whether the current account requires onboarding or whether you can continue to send requests as usual. You may skip calling this if you're restoring an existing session.",
        await success(
            "Onboarding information.",
            ref("OnboardingInformation")
        )
    )
});

resource('/onboard/complete', {
    post: routeAuthenticated(
        "Complete Onboarding",
        "This sets a new username, completes onboarding and allows a user to start using Revolt.",
        {
            ...await body("Data about wanted user information.", schema`
                interface ${'OnboardingComplete'} {
                    /**
                     * An alphanumeric username which is used to identify the user on the platform.
                     * @example insert
                     * @minLength 2
                     * @maxLength 32
                     * @pattern ^[a-zA-Z0-9-_]+$
                     */
                    username: string;
                }
            `),
            ...await noContent("Successfully set username")
        }
    )
});
