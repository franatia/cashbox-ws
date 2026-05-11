import { BadRequestException } from "@nestjs/common";

export const extractFromRequestByPath = (
    request: any, path: string
) : any[] => {
 
    const parts = path.split('.');

    let current = [request];

    for (const part of parts) {

        const isArray = part.endsWith('[]');
        const remain = isArray ? part.replace('[]', '') : part;
        
        const isOptional = remain.endsWith('?');
        const key = isOptional ? remain.replace('?', '') : remain;

        const next: any[] = [];

        for (const item of current) {

            const value = item?.[key];

            if (value === undefined || value === null) continue;

            if (isArray) {
                if (Array.isArray(value)) {
                    next.push(...value);
                }
            } else {
                next.push(value);
            }

        }
        current = next;

        if(!next.length && !isOptional){
            throw new BadRequestException(`Request required ${key} inside path ${path}`);
        }

        if(!next.length && isOptional) break;

    }

    return current;

}