import { AccessService } from "@/access/access.service";
import { AccessConfigMetadata } from "@/access/decorators/access.decorator";
import { extractFromRequestByPath } from "@/access/helpers/request";
import { NodeLitePolicie } from "@/access/policies/node/lite.policie";
import { Policie, PoliciePayload } from "@/access/policies/policie";

export default class GetNodeContextPolicie extends Policie {

    async verify(
        payload : PoliciePayload,
        accessService: AccessService,
        accessConfig: AccessConfigMetadata
    ): Promise<boolean> {
        const {
            request
        } = payload;
        const selectCollaborators = extractFromRequestByPath(request, "selectCollaborators")[0];

        if(!selectCollaborators) return true;

        const policie = new NodeLitePolicie();
        return await policie.verify(payload, accessService, accessConfig);

    }

}