export class EventCost {
    public event: GoogleAppsScript.Calendar.CalendarEvent;
    public cost: number;

    constructor(evt: GoogleAppsScript.Calendar.CalendarEvent, cst: number) {
        this.event = evt;
        this.cost = cst;
    }
}