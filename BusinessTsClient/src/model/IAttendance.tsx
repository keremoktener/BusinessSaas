export interface IAttendance {
    id: number;
    employeeId: number;
    firstName: string;
    lastName: string;
    date: Date;
    checkInTime: string;  
    checkOutTime: string;  
    status: string;
}