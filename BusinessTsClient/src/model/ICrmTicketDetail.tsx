export interface ICrmTicketDetail{
    id: number
    subject: string
    description: string
    ticketStatus: string
    priority: string
    createdDate: Date
    closedDate: Date
    customers: number[]
    memberId: number
    status:string
    firstName: string;
    lastName: string;

}