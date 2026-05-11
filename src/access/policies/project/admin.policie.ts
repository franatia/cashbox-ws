import { AccessService } from "@/access/access.service";
import { AccessConfigMetadata } from "@/access/decorators/access.decorator";
import { policieValidator } from "@/access/helpers/policie";
import { Policie, PoliciePayload } from "../policie";

export class ProjectAdminPolicie extends Policie {
    async verify(
        payload: PoliciePayload,
        accessService: AccessService,
        accessConfig: AccessConfigMetadata
    ): Promise<boolean> {

        const {
            token
        } = payload;

        const {
            sub: user,
            context
        } = token;

        const { wholeProject = true } = accessConfig;

        return await policieValidator(
            accessConfig,
            context,
            "projectId",
            ([value]) => {
                return accessService.hasProjectAdminAccess(
                    value,
                    user,
                    wholeProject
                );
            }
        )

    }
}