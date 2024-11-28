export interface ICustomer {
    id: number;
    memberId:number
    identityNo:string,
    phoneNo:string
    name:string
    surname:string
    email:string
    createdAt:Date;
    updatedAt:Date;
    status:string
}