import { IUser } from "./IUser";

export interface IPageableUserList {
    userList: IUser[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
}