export interface ICrmCustomer {
    id: number;
    memberId:number
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    status:string
}