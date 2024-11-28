export interface IStockMovement {
    id: number;
    memberId:number
    productId:number;
    warehouseId:number;
    quantity:number;
    stockMovementType:string;
    createdAt:Date;
    updatedAt:Date;
    status:string
}