import { Column, ColumnOptions } from "typeorm";

export default function DecimalColumn(options ?: ColumnOptions) : PropertyDecorator {
    return Column({
        type: "decimal",
        precision: 14,
        scale: 2,
        transformer: {
            to: (value?: number) => value,
            from: (value: string) => Number(value),
        },
        ...options
    })
}