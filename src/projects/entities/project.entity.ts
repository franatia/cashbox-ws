import { User } from "@/auth/entities";
import { DatabaseSchemas } from "@/common/constants/database-schemas.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Collaborator } from "./collaborator.entity";
import { Node } from "./node.entity";
import { Product } from "@/product/entities/product.entity";
import { Order } from "@/order/entities/order.entity";
import { Cashbox } from "@/cashbox/entities/cashbox.entity";
import { Stock } from "@/stock/entities/stock.entity";
import { Customer } from "@/customer/entities/customer.entity";
import { custom } from "joi";
import { Tax } from "@/tax/entities/tax.entity";
import { PriceList } from "@/price/entities/price-list.entity";
import { ProductGroup } from "@/product/entities/product-group.entity";
import { Rule } from "@/rule/entities/rule.entity";
import { Debt } from "@/debt/entities/debt.entity";
import { StockTransfer } from "@/stock/entities/stock-transfer.entity";
import { CustomerSegment } from "@/customer/entities/customer-segment.entity";
import { TaxSchema } from "@/tax/entities/tax-schema.entity";

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
        collaborator => collaborator.project,
        {
            nullable: false,
            eager: false
        }
    )
    collaborators! : Collaborator[]

    @OneToMany(
        () => Node,
        node => node.project,
        {
            eager: false,
            nullable: false
        }
    )
    nodes!: Node[]

    @OneToMany(
        () => Product,
        product => product.project,
        {
            eager: false,
            nullable: false
        }
    )
    products !: Product[]

    @OneToMany(
        () => ProductGroup,
        productGroup => productGroup.project,
        {
            eager: false,
            nullable: false
        }
    )
    productGroups!: ProductGroup[];

    @OneToMany(
        () => Order,
        order => order.project,
        {
            eager: false,
            nullable: false
        }
    )
    orders!: Order[];

    @OneToMany(
        () => Cashbox,
        cashbox => cashbox.project,
        {
            eager: false,
            nullable: false
        }
    )
    cashboxes!: Cashbox[];

    @OneToMany(
        () => Stock,
        stock => stock.project,
        {
            eager: false,
            nullable: false
        }
    )
    stock!: Stock[]

    @OneToMany(
        () => StockTransfer,
        stockTransfer => stockTransfer.project,
        {
            eager: false
        }
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
        {
            eager: false,
            nullable: false
        }
    )
    customerSegments!: CustomerSegment[]

    @OneToMany(
        () => TaxSchema,
        taxSchema => taxSchema.project,
        {
            eager: false,
            nullable: false
        }
    )
    taxSchemas!: TaxSchema[];

    @OneToMany(
        () => PriceList,
        priceList => priceList.project,
        {
            eager: false,
            nullable: false
        }
    )
    priceLists!: PriceList[]

    @OneToMany(
        () => Rule,
        rule => rule.project,
        {
            eager: false
        }
    )
    rules!: Rule[];

    @OneToMany(
        () => Debt,
        debt => debt.project,
        {
            eager: false
        }
    )
    debts!: Debt[]

}
