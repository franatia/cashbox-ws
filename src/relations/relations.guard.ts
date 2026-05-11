import { BadRequestException, CanActivate, ExecutionContext, Injectable, ParseUUIDPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RELATIONS_CONFIG, RelationsConfigItem } from "./decorators/relations.decorator";
import { extractFromRequestByPath } from "../access/helpers/request";
import { RelationsEngine } from "./relations.engine";
import { plainRequest } from "@/common/helpers/request.helper";
import { isUUID } from "class-validator";

@Injectable()
export class RelationsGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly relationsEngine: RelationsEngine
    ) { }

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {

        const config = this.reflector.getAllAndOverride<RelationsConfigItem[]>(
            RELATIONS_CONFIG,
            [context.getHandler(), context.getClass()]
        );

        if (!config) return true;

        const request = context.switchToHttp().getRequest();
        const payload = this.plainRequest(request);

        await this.runRelationsEngine(config, payload);

        return true;
    }

    private plainRequest(req: any): any {

        const plainedReq = plainRequest(req);

        return plainedReq;

    }

    private validateValues(
        values: any[],
        path: string
    ) {

        if (values.some(value => !isUUID(value, "4"))) {
            throw new BadRequestException(`Values inside '${path}' are not UUID values`)
        }

    }

    private async runRelationsEngine(
        config: RelationsConfigItem[],
        request: any
    ) {

        const promises: Promise<any>[] = [];

        for (const { from, to, rule } of config) {

            const fromValues = extractFromRequestByPath(
                request,
                from
            )

            const toValues = extractFromRequestByPath(
                request,
                to
            )

            if (!fromValues.length || !toValues.length) continue;

            this.validateValues(fromValues, from);
            this.validateValues(toValues, to);

            promises.push(
                this.relationsEngine.runEngine(
                    rule,
                    fromValues,
                    toValues
                )
            )
        }

        await Promise.all(promises);

    }

}