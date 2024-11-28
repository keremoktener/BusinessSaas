export interface IProduct {
    id: number;
    memberId:number
    supplierId:number
    wareHouseId:number
    productCategoryId:number;
    name: string;
    description: string;
    price: number;
    stockCount: number;
    minimumStockLevel: number;
    createdAt:Date;
    updatedAt:Date;
    status:string
}