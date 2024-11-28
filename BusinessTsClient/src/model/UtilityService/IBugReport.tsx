export interface IBugReport {
    id: number;
    authId: number;
    subject: string;
    description: string;
    adminFeedback: string;
    resolvedAt:Date;
    bugStatus: string;
    version: string;
    createdAt:Date;
    updatedAt:Date;
    status:string
}