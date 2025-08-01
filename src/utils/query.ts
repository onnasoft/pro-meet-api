import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsObject,
  ValidateNested,
  IsString,
  IsArray,
} from 'class-validator';
import {
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsOrder,
  FindOperator,
  MoreThanOrEqual,
  LessThanOrEqual,
  MoreThan,
  LessThan,
  Like,
  ILike,
  Not,
  In,
  Between,
  FindOptionsSelect,
  FindOneOptions,
  IsNull,
} from 'typeorm';

export class QueryParams<T> {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  select?: FindOptionsSelect<T>;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  where?: FindOptionsWhere<T>;

  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string'
      ? value.split(',').map((v) => v.trim())
      : value;
  })
  @IsArray()
  @IsString({ each: true })
  relations?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string'
      ? value.split(',').map((v) => v.trim())
      : value;
  })
  @IsArray()
  @IsString({ each: true })
  order?: string[];

  @IsOptional()
  @IsNumber()
  @ValidateNested()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsString()
  take?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsNumber()
  page?: number;
}

const isNull = '[isNull]';

const operatorMap: Record<string, (val: any) => FindOperator<any>> = {
  gte: (val) => MoreThanOrEqual(val),
  lte: (val) => LessThanOrEqual(val),
  gt: (val) => MoreThan(val),
  lt: (val) => LessThan(val),
  like: (val) => Like(`%${val}%`),
  ilike: (val) => ILike(`%${val}%`),
  not: (val) => Not(isNull === val ? IsNull() : val),
  in: (val) => In(val.split(',')),
  notIn: (val) => Not(In(val.split(','))),
  between: (val) => {
    const [start, end] = val.split(',');
    return Between(inferValue(start), inferValue(end));
  },
};

const inferValue = (value: string): any => {
  if (value === isNull) return IsNull();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(Number(value))) return Number(value);
  const date = new Date(value);
  if (!isNaN(date.getTime())) return date;
  return value;
};

const regex = /where\[([\w.]+)\](?:\[(\w+)\])?/;
function handleWhereKey(key: string, value: any, where: Record<string, any>) {
  const match = regex.exec(key);
  if (!match) return;

  const [, field, op] = match;
  const raw = value;

  const path = field.split('.');
  const lastField = path.pop();
  if (!lastField) return;
  let baseField = where;
  for (const p of path) {
    if (!where[p]) {
      baseField = baseField[p] = {};
    } else {
      baseField = baseField[p];
    }
  }

  if (op && operatorMap[op]) {
    baseField[lastField] = operatorMap[op](raw);
    return;
  }

  baseField[lastField] = inferValue(raw);
}

function handleSelectKey(
  key: string,
  value: any,
  options: FindManyOptions<any>,
) {
  const field = key.slice(7, -1);

  if (!options.select) {
    options.select = {
      id: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  const path = field.split('.');
  const lastField = path.pop();
  if (!lastField) return;
  let baseField = options.select;
  for (const p of path) {
    if (!options.select[p]) {
      options.select[p] = {};
      baseField = options.select[p];
    }
  }

  baseField[lastField] = value === 'true' || value === true;
}

export function buildFindManyOptions<
  T extends { id: string; createdAt: Date; updatedAt: Date },
>(query: Record<string, any>): FindManyOptions<T> {
  const baseOptions = buildFindOneOptions<T>(query);
  const options: FindManyOptions<T> = {};

  options.select = baseOptions.select;
  options.where = baseOptions.where;
  options.relations = baseOptions.relations;

  if (query.order) {
    const order: FindOptionsOrder<T> = {};
    const parts = query.order as string[];
    parts.forEach((part) => {
      const [field, dir] = part.split(':');
      if (field && dir && ['ASC', 'DESC'].includes(dir.toUpperCase())) {
        order[field.trim() as any] = dir.toUpperCase() as 'ASC' | 'DESC';
      }
    });
    options.order = order;
  } else {
    options.order = { createdAt: 'DESC' } as FindOptionsOrder<T>;
  }

  if (query.skip !== undefined) {
    options.skip = Number(query.skip);
  }

  options.take =
    query.limit !== undefined || query.take !== undefined
      ? Number(query.limit ?? query.take)
      : 10;

  if (query.page !== undefined) {
    options.skip = (Number(query.page) - 1) * options.take;
  }

  return options;
}

export function buildFindOneOptions<
  T extends { id: string; createdAt: Date; updatedAt: Date },
>(query: Record<string, any>): FindOneOptions<T> {
  const options: FindOneOptions<T> = {};
  const where: Record<string, any> = {};

  Object.keys(query).forEach((key) => {
    if (key.startsWith('where[')) {
      handleWhereKey(key, query[key], where);
    } else if (key.startsWith('select[')) {
      handleSelectKey(key, query[key], options);
    }
  });

  if (options.select) {
    handleSelectKey('id', true, options);
  }

  options.relations = [];
  if (query.relations) {
    const relations: string[] = Array.from(
      new Set(query.relations.map((r: string) => r.trim())),
    );
    options.relations = relations;
  }
  options.relations = options.relations ?? [];
  const relations = options.relations as string[];
  const locale = query.locale;
  if (locale) {
    relations.push('translations');
    where.translations = { locale };
  }

  if (Object.keys(where).length > 0) {
    options.where = where;
  }

  return options;
}
