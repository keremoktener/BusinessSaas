import {IDepartment} from "./IDepartment.tsx";

export interface IEmployee {
    id: number;
    memberId:number
    authId: number;
    department:IDepartment;
    manager:IEmployee;
    subordinates:IEmployee[];
    identityNo: string;
    phoneNo: string;
    name: string;
    surname:string;
    title:string;
    email: string;
    isAccountGivenToEmployee:boolean;
    createdAt:Date;
    updatedAt:Date;
    status:string
}