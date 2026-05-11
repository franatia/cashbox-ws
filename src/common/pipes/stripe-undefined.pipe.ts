import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class StripUndefinedPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return value;
    }

    return Object.fromEntries(
      Object.entries(value).filter(([_, v]) => v !== undefined)
    );
  }
}