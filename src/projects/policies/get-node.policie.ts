import { AccessService } from "@/access/access.service";
import { AccessConfigMetadata } from "@/access/decorators/access.decorator";
import { extractFromRequestByPath } from "@/access/helpers/request";
import { Policie, PoliciePayload } from "@/access/policies/policie";
import { ProjectLitePolicie } from "@/access/policies/project/lite.policie";

export default class GetNodePolicie extends Policie {

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

        const policie = new ProjectLitePolicie();
        return await policie.verify(payload, accessService, accessConfig);

    }

}