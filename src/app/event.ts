export class Event{
    startDateTime?:string
    endDateTime?:string
    name?:string
    description?:string
    location?:string
    userEmail?:string | null
    company?:string
    id?:number
    peopleInterested?:number

    public constructor(init?: Partial<Event>) {
        Object.assign(this, init);
    }
}