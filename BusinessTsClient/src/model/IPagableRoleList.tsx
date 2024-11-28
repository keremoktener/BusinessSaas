import { IRole } from "./IRole";

export interface IPagableRoleList {
    roleList: IRole[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
}