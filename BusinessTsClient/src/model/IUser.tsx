export interface IUser {
    id: number;
    authId: number;
    email: string;
    firstName: string;
    lastName: string;
    status?: string;
    userRoles: string[];
}
