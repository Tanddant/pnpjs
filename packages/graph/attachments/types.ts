import { Attachment as IAttachmentType } from "@microsoft/microsoft-graph-types";
import { body } from "@pnp/queryable";
import { _GraphCollection, _GraphInstance, graphInvokableFactory, graphPost } from "../graphqueryable.js";
import { defaultPath, getById, IGetById } from "../decorators.js";
import { type } from "../utils/type.js";

/**
 * Attachment
 */
export class _Attachment extends _GraphInstance<IAttachmentType> { }
export interface IAttachment extends _Attachment { }
export const Attachment = graphInvokableFactory<IAttachment>(_Attachment);

/**
 * Attachments
 */
@defaultPath("attachments")
@getById(Attachment)
export class _Attachments extends _GraphCollection<IAttachmentType[]> {

    /**
     * Add attachment to this collection
     *
     * @param name Name given to the attachment file
     * @param bytes File content
     */
    public addFile(name: string, bytes: string | Blob): Promise<IAttachmentType> {

        return graphPost(this, body(type("#microsoft.graph.fileAttachment", {
            contentBytes: bytes,
            name,
        })));
    }
}
export interface IAttachments extends _Attachments, IGetById<IAttachment> {}
export const Attachments = graphInvokableFactory<IAttachments>(_Attachments);
