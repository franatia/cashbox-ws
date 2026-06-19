import { User } from "@/auth/entities";
import { DatabaseSchemas } from "@/common/enum/db/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Collaborator } from "./collaborator.entity";
import { Node } from "./node.entity";
import { Product } from "@/product/entities/product.entity";
import { Order } from "@/order/entities/order.entity";
import { Cashbox } from "@/cashbox/entities/cashbox.entity";
import { Customer } from "@/customer/entities/customer.entity";
import { PriceList } from "@/price/entities/price-list.entity";
import { Group } from "@/product/entities/group.entity";
import { Rule } from "@/rule/entities/rule.entity";
import { Debt } from "@/debt/entities/debt.entity";
import { CustomerSegment } from "@/customer/entities/customer-segment.entity";
import { FeatureSchema } from "@/feature-schema/entities/feature-schema.entity";
import { Catalog } from "@/catalog/entities/catalog.entity";
import { LinkingCatalog } from "@/catalog/entities/linking-catalog.entity";
import { TaxProfile } from "@/tax/entities/tax-profile.entity";
import { Transfer as StockTransfer } from "@/stock/entities/transfer/transfer.entity";

@Entity({
    schema: DatabaseSchemas.main,
    name: "projects"
})
export class Project {
    @PrimaryGeneratedColumn("uuid")
    id! : string

    @Column({
        type: "text"
    })
    name!: string

    @CreateDateColumn({
        type: "timestamptz"
    })
    createdAt!: Date

    @ManyToOne(
        () => User,
        user => user.projects,
        {
            eager: false,
            onDelete: "CASCADE",
            nullable: false
        }
    )
    owner!: User

    @OneToMany(
        () => Collaborator,
        collaborator => collaborator.project
    )
    collaborators! : Collaborator[]

    @OneToMany(
        () => Node,
        node => node.project
    )
    nodes!: Node[]

    @OneToMany(
        () => Product,
        product => product.project
    )
    products !: Product[]

    @OneToMany(
        () => Catalog,
        catalog => catalog.project
    )
    catalogs !: Catalog[]

    @OneToMany(
        () => LinkingCatalog,
        linkingCatalog => linkingCatalog.project
    )
    linkingCatalogs !: LinkingCatalog[]

    @OneToMany(
        () => Group,
        group => group.project
    )
    groups!: Group[];

    @OneToMany(
        () => Order,
        order => order.project
    )
    orders!: Order[];

    @OneToMany(
        () => Cashbox,
        cashbox => cashbox.project
    )
    cashboxes!: Cashbox[];

    @OneToMany(
        () => StockTransfer,
        stockTransfer => stockTransfer.project
    )
    stockTransfers !: StockTransfer[];


    @OneToMany(
        () => Customer,
        customer => customer.project,
        {
            eager: false,
            nullable: false
        }
    )
    customers!: Customer[]

    @OneToMany(
        () => CustomerSegment,
        customerSegment => customerSegment.project,
    )
    customerSegments!: CustomerSegment[];

    @OneToOne(
        () => TaxProfile,
        taxProfile => taxProfile.project
    )
    taxProfile ?: TaxProfile;

    @OneToMany(
        () => FeatureSchema,
        featureSchema => featureSchema.project,
    )
    featureSchemas!: FeatureSchema[];

    @OneToMany(
        () => PriceList,
        priceList => priceList.project
    )
    priceLists!: PriceList[]

    @OneToMany(
        () => Rule,
        rule => rule.project
    )
    rules!: Rule[];

    @OneToMany(
        () => Debt,
        debt => debt.project
    )
    debts!: Debt[]

}
