import { BadRequestException } from '@nestjs/common';

export const extractFromRequest = (request: any, key: string) => {

    const value =
        request?.body?.[key] ??
        request?.query?.[key] ??
        request?.params?.[key];

    if (!value) {
        throw new BadRequestException(`${key} is required`);
    }

    return value;
};