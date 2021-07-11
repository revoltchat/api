import type { Attachment } from "./Autumn";
import type { Id } from "./_common";

export type ServerInvite = {
    type: 'Server'
    _id: Id
    server: Id
    creator: Id
    channel: Id
}

export type Invite = ServerInvite;

export type RetrievedInvite = {
    type: 'Server'
    server_id: Id
    server_name: string
    server_icon?: Attachment
    server_banner?: Attachment
    channel_id: Id
    channel_name: string
    channel_description?: string
    user_name: string
    user_avatar?: Attachment
}
