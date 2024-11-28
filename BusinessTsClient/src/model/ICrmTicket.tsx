export interface ICrmTicket{
    id: number;
    memberId: number;
    customers: number[];
    subject: string;
    description: string;
    ticketStatus: string;
    priority: string;
    createdDate: Date;
    closedDate: Date;
    status: string;
}