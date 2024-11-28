import {IDepartment} from "./IDepartment.tsx";

export interface IManager {
    id: number;
    memberId:number
    authId: number;
    department:IDepartment;
    identityNo: string;
    phoneNo: string;
    name: string;
    surname:string;
    email: string;
    createdAt:Date;
    updatedAt:Date;
    status:string
}