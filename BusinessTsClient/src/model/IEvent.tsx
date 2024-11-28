export interface IEvent {
    id: number;
    title: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
    authId:number;
    status: string;
}
