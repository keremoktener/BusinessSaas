export interface IBugReportResponse {
    id: number;
    email: string;
    subject: string;
    description: string;
    adminFeedback: string;
    resolvedAt:Date;
    bugStatus: string;
    version:string;
}