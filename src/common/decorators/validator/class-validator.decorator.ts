import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOne(fields: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOne',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [fields],
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;
          const [fields] = args.constraints;

          return fields.some(field => obj[field] !== undefined && obj[field] !== null);
        },
      },
    });
  };
}