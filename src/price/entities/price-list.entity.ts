import { Channel } from "@/common/constants/channel.enum";
import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Project } from "@/projects/entities/project.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum PriceListFactorType {
    PERCENT = "PERCENT",
    AMOUNT = "AMOUNT"
}

@Entity({
    schema: DatabaseSchemas.main,
    name: "price-lists"
})
export class PriceList{

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "text"
    })
    name!: string;

    @Column({
        type: "enum",
        enum: PriceListFactorType,
        default: PriceListFactorType.PERCENT
    })
    factorType!: PriceListFactorType;

    @Column({
        type: "int",
        default: 1
    })
    factorValue!: number;

    @Column({
        type: "text",
        nullable: true
    })
    currency!: string | null;

    @Column({
        type: "enum",
        enum: Channel,
        array: true
    })
    channels!: Channel[];

    @Column({
        type: "int"
    })
    priority!: number;

    @Column({
        type: "boolean",
        default: true
    })
    active!: boolean;

    @Column({
        type: "timestamptz",
        nullable: true
    })
    validFrom!: Date;

    @Column({
        type: "timestamptz",
        nullable: true
    })
    validTo!: Date;

    @ManyToOne(
        () => Project,
        project => project.priceLists,
        {
            eager: false,
            onDelete: "CASCADE"
        }
    )
    project !: Project;

}