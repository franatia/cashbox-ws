export type ProductItemParams = {
    id: string;
    baseCost?: number;
    quantity : number;
}

export type StrictProductItemParams = Required<ProductItemParams> & {
    costId : string
}