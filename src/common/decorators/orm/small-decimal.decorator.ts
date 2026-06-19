import { Column, ColumnOptions } from "typeorm";

export default function SmallDecimalColumn(options ?: ColumnOptions) : PropertyDecorator {
    return Column({
        type: "decimal",
        precision: 12,
        scale: 6,
        transformer: {
            to: (value?: number) => value,
            from: (value: string) => Number(value),
        },
        ...options
    })
}