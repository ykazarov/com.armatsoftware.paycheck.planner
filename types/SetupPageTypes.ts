// keys used for naming controls and properties
const InitialBudgetAmountFieldName = "initial_budget_amount";
const InitialBudgetDateFieldName = "initial_budget_date";
const EndBudgetDateFieldName = "end_budget_date";
const SourceCalendarFieldName = "source_calendar";
// const IncludeZeroCostsFieldName = "include_zero_costs";

export interface StringInputs {
    value: string[];
}

export interface InitialBudgetAmount {
    stringInputs: StringInputs;
}

export interface SourceCalendar {
    stringInputs: StringInputs;
}

export interface DateInput {
    msSinceEpoch: number;
}

export interface BudgetDate {
    dateInput: DateInput;
}

/**
 * eventObject model mimicking the JSON model of setup save events
 */
export interface SetupPageFormInputs {
    initial_budget_amount: InitialBudgetAmount;
    source_calendar: SourceCalendar;
    initial_budget_date: BudgetDate;
    end_budget_date: BudgetDate;
}

/**
 * validation model for setup page
 */
export class SetupModel {

    public FromDate: Date;
    public ToDate: Date;
    public InitialBalance: number;
    public Calendar: GoogleAppsScript.Calendar.Calendar;


    public errors: string[] = [];

    public isValid(): boolean {
        this.errors = [];
        if (!this.FromDate || this.FromDate === null) this.errors.push("From Date is invalid");
        if (!this.ToDate || this.ToDate === null) this.errors.push("To Date is invalid");
        if (this.FromDate > this.ToDate) this.errors.push("From Date has to be after the To Date");
        if (!this.Calendar || this.Calendar === null) this.errors.push("Calendar is not specified or invalid");
        if (!this.InitialBalance || this.InitialBalance === null || this.InitialBalance < 0) this.errors.push("Invalid initial balance");

        return this.errors.length === 0;
    }

    public static load(): SetupModel {
        // read settings
        var userProperties = PropertiesService.getUserProperties();
        var startDateInMsSinceEpoch = userProperties.getProperty(InitialBudgetDateFieldName);
        var endDateInMsSinceEpoch = userProperties.getProperty(EndBudgetDateFieldName);
        var initialBudgetAmount = userProperties.getProperty(InitialBudgetAmountFieldName);
        var sourceCalendar = userProperties.getProperty(SourceCalendarFieldName);

        Logger.log([
            { "Start Date Text": startDateInMsSinceEpoch },
            { "End Date Text": endDateInMsSinceEpoch }
        ]);

        var result = new SetupModel();
        if(startDateInMsSinceEpoch && startDateInMsSinceEpoch !== null) {
            result.FromDate = new Date(Number(startDateInMsSinceEpoch));
        }
        if (endDateInMsSinceEpoch && endDateInMsSinceEpoch !== null) {
            result.ToDate = new Date(Number(endDateInMsSinceEpoch));
        }
        result.Calendar = CalendarApp.getCalendarsByName(sourceCalendar)[0];
        result.InitialBalance = Number(initialBudgetAmount);

        return result;
    }
}