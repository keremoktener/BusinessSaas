export interface IOrder {
    id: number;
    memberId:number
    customerId:number
    supplierId:number
    productId:number
    quantity:number
    unityPrice:number
    total:number
    createdAt:Date;
    updatedAt:Date;
    status:string
}