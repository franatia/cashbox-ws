import { AccessService } from "@/access/access.service";
import { AccessConfigMetadata } from "@/access/decorators/access.decorator";
import { policieValidator } from "@/access/helpers/policie";
import { Policie, PoliciePayload } from "../policie";

export class NodeAdminPolicie extends Policie {
    async verify(
        payload: PoliciePayload,
        accessService: AccessService,
        accessConfig: AccessConfigMetadata
    ): Promise<boolean> {

        const {
            token
        } = payload;

        const {
            sub : user,
            context
        } = token;

        return await policieValidator(
            accessConfig,
            context,
            "nodeId",
            ([value]) => {
                return accessService.hasNodeAdminAccess(
                    value,
                    user
                );
            }
        )
    }

}