import { isURL, registerDecorator, ValidationOptions } from 'class-validator';

export function IsUrlOrEmpty(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUrlOrEmpty',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === '' || isURL(value);
        },
      },
    });
  };
}

export function IsPhoneNumberOrEmpty(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumberOrEmpty',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === undefined || value === null || value === '')
            return true;
          return /^[\d\s+\-()]{7,}$/.test(value);
        },
      },
    });
  };
}
