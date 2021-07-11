import type { Id } from "./_common";

export interface Session {
    /**
     * Session ID
     */
    id?: Id,

    /**
     * User ID
     */
    user_id: Id,

    /**
     * @maxLength 64
     */
    session_token: string
}
