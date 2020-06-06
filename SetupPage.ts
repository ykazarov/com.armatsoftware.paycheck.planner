import { SetupPageFormInputs } from "./types/SetupPageTypes";
// import * as navigator from "./navigation/navigator";
// import * as icons from "./assets/icons";

const CalendarNotSelectedOption = "not_selected";
const SetupDirectionsText = "Set up the initial parameters for expense monitoring."
    + "\r\n1. Select calendar to monitor"
    + "\r\n2. Set initial amount on hands"
    + "\r\n3. Set date range for expense projection";

// keys used for naming controls and properties
const InitialBudgetAmountFieldName = "initial_budget_amount";
const InitialBudgetDateFieldName = "initial_budget_date";
const EndBudgetDateFieldName = "end_budget_date";
const SourceCalendarFieldName = "source_calendar";
// const IncludeZeroCostsFieldName = "include_zero_costs";

/**
 * Sets up the Setup page UI
 */
export class SetupPage {

    public BuildCard() {
        var setupCard = CardService.newCardBuilder()
            .setHeader(CardService.newCardHeader()
                .setTitle("Setup")
                .setImageUrl(SetupIconUrl));

        setupCard.addSection(this.buildToolbarSection())
        setupCard.addSection(this.buildSetupSection());

        return setupCard.build();
    }

    private buildToolbarSection(): GoogleAppsScript.Card_Service.CardSection {
        return CardService.newCardSection()
            .addWidget(CardService.newButtonSet()
                .addButton(CardService.newImageButton()
                    .setIconUrl(MonitorIconUrl)
                    .setAltText("Plan and Monitor")
                    .setOnClickAction(CardService.newAction().setFunctionName(goToPlanMonitor.name)))
                .addButton(CardService.newImageButton()
                    .setIconUrl(HelpDeskIconUrl)
                    .setAltText("Help Desk")
                    .setOpenLink(CardService.newOpenLink()
                        .setUrl("https://paycheckplanner.armatlab.com/index.php?a=add&catid=2")
                        .setOpenAs(CardService.OpenAs.OVERLAY)
                        .setOnClose(CardService.OnClose.NOTHING))));
    }

    private buildSetupSection(): GoogleAppsScript.Card_Service.CardSection {
        return CardService.newCardSection()
            .addWidget(CardService.newTextParagraph()
                .setText(SetupDirectionsText))
            .addWidget(this.buildCalendarWidget())
            .addWidget(this.buildInitialBudgetWidget())
            .addWidget(this.buildInitialDateWidget())
            .addWidget(this.buildEndDateWidget());
        // .addWidget(CardService.newKeyValue()
        //     .setContent("Zero Cost Events")
        //     .setSwitch(this.buildZeroCostSwitchWidget());
    }

    // private buildZeroCostSwitchWidget() {
    //     var onSetupChangedAction = CardService.newAction()
    //     .setFunctionName(onSetupChanged.name);

    //     var zeroCostEventsToggle = CardService.newSwitch()
    //         .setOnChangeAction(onSetupChangedAction)
    //         .setFieldName(IncludeZeroCostsFieldName);

    //     return zeroCostEventsToggle;
    // }

    private buildInitialBudgetWidget() {
        var onSetupChangedAction = CardService.newAction()
            .setFunctionName(onSetupChanged.name);

        var userProperties = PropertiesService.getUserProperties();
        var initialBudgetAmount = userProperties.getProperty(InitialBudgetAmountFieldName);
        Logger.log("Read balance: " + initialBudgetAmount);

        var inputBudget = CardService.newTextInput()
            .setFieldName(InitialBudgetAmountFieldName)
            .setHint("Initial Balance")
            .setOnChangeAction(onSetupChangedAction);

        if (initialBudgetAmount && Number.parseFloat(initialBudgetAmount) > 0) {
            inputBudget.setValue(initialBudgetAmount);
        } else {
            inputBudget.setValue("0.00")
        }

        return inputBudget;
    }

    private buildInitialDateWidget() {
        var onSetupChangedAction = CardService.newAction()
            .setFunctionName(onSetupChanged.name);

        var datePicker = CardService.newDatePicker()
            .setFieldName(InitialBudgetDateFieldName)
            .setTitle("Initial Date")
            .setOnChangeAction(onSetupChangedAction);

        var userProperties = PropertiesService.getUserProperties();
        var savedDateInMsSinceEpoch = userProperties.getProperty(InitialBudgetDateFieldName);
        Logger.log("Read initial dte: " + savedDateInMsSinceEpoch);

        if (savedDateInMsSinceEpoch && savedDateInMsSinceEpoch !== null) {
            datePicker.setValueInMsSinceEpoch(Number.parseInt(savedDateInMsSinceEpoch));
        }
        return datePicker;
    }

    private buildEndDateWidget() {
        var onSetupChangedAction = CardService.newAction()
            .setFunctionName(onSetupChanged.name);

        var datePicker = CardService.newDatePicker()
            .setFieldName(EndBudgetDateFieldName)
            .setTitle("End Date")
            .setOnChangeAction(onSetupChangedAction);

        var userProperties = PropertiesService.getUserProperties();
        var savedDateInMsSinceEpoch = userProperties.getProperty(EndBudgetDateFieldName);
        Logger.log("Read end dte: " + savedDateInMsSinceEpoch);

        if (savedDateInMsSinceEpoch && savedDateInMsSinceEpoch !== null) {
            datePicker.setValueInMsSinceEpoch(Number.parseInt(savedDateInMsSinceEpoch));
        }
        return datePicker;
    }

    private buildCalendarWidget() {
        var onSetupChangedAction = CardService.newAction()
            .setFunctionName(onSetupChanged.name);

        var calendars = CalendarApp.getAllOwnedCalendars();

        var userProperties = PropertiesService.getUserProperties();
        var sourceCalendar = userProperties.getProperty(SourceCalendarFieldName);
        Logger.log("Read souce calendar: " + sourceCalendar);

        var calendarInput = CardService.newSelectionInput()
            .setFieldName(SourceCalendarFieldName)
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setTitle("Select Calendar")
            .setOnChangeAction(onSetupChangedAction)
            .addItem("Not Selected", CalendarNotSelectedOption, sourceCalendar == CalendarNotSelectedOption);

        for (var i = 0; i < calendars.length; i++) {
            var item = calendars[i];
            calendarInput.addItem(item.getId(), item.getId(), sourceCalendar == item.getId());
        }
        return calendarInput;
    }
}

/**
 * Save all setup values in user properties
 * @param setupEvent JSON event object supplied by CalendarApp
 */
function onSetupChanged(setupEvent): GoogleAppsScript.Card_Service.ActionResponse {
    Logger.log(setupEvent);

    var userProperties = PropertiesService.getUserProperties();

    // deleting these values impacts switch from setup to monitor page
    // userProperties.deleteProperty(this.InitialBudgetAmountFieldName);
    // userProperties.deleteProperty(this.InitialBudgetDateFieldName);
    // userProperties.deleteProperty(this.SourceCalendarFieldName);

    var event = setupEvent.commonEventObject;
    if (event.formInputs) {
        var formInputs = event.formInputs as SetupPageFormInputs;

        if (formInputs.initial_budget_amount) {
            var initialBudgetAmount = formInputs.initial_budget_amount.stringInputs.value[0];
            Logger.log("Saving initial balance: " + initialBudgetAmount);
            userProperties.setProperty(this.InitialBudgetAmountFieldName, initialBudgetAmount);
        } else {
            userProperties.deleteProperty(this.InitialBudgetAmountFieldName);
        }

        if (formInputs.initial_budget_date 
            && formInputs.initial_budget_date.dateInput 
            && formInputs.initial_budget_date.dateInput.msSinceEpoch) {
            var initialBudgetDate = formInputs.initial_budget_date.dateInput.msSinceEpoch;
            Logger.log("Saving start date: " + initialBudgetDate);
            userProperties.setProperty(this.InitialBudgetDateFieldName, initialBudgetDate.toString());
        } else {
            userProperties.deleteProperty(this.InitialBudgetDateFieldName);
        }

        if (formInputs.end_budget_date 
            && formInputs.end_budget_date.dateInput 
            && formInputs.end_budget_date.dateInput.msSinceEpoch) {
            var endBudgetDate = formInputs.end_budget_date.dateInput.msSinceEpoch;
            Logger.log("Saving end date: " + endBudgetDate);
            userProperties.setProperty(this.EndBudgetDateFieldName, endBudgetDate.toString());
        } else {
            userProperties.deleteProperty(this.EndBudgetDateFieldName);
        }

        if (formInputs.source_calendar) {
            var sourceCalendar = formInputs.source_calendar.stringInputs.value[0];
            Logger.log("Saving calendar: " + sourceCalendar);
            userProperties.setProperty(this.SourceCalendarFieldName, sourceCalendar);
        } else {
            userProperties.deleteProperty(this.SourceCalendarFieldName);
        }
    }

    return CardService.newActionResponseBuilder()
        .setStateChanged(true)
        .setNavigation(CardService.newNavigation().popToRoot().pushCard(new SetupPage().BuildCard()))
        // .setNotification(CardService.newNotification().setText("Setup saved"))
        .build();
}
