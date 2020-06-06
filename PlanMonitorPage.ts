import { EventCost } from "./types/EventCostModel";
import { L10n } from "./assets/l10n";
import { SetupModel } from "./types/SetupPageTypes";

export class PlanMonitorPage {

    private moneyFormatter: Intl.NumberFormat = L10n.getLocalCurrencyFormatter();
    private dateFormatter: Intl.DateTimeFormat = L10n.getLocalDateFormatter();

    public BuildCard() {
        var monitorCard = CardService.newCardBuilder()
            .setHeader(CardService.newCardHeader()
                .setTitle("Plan and Monitor")
                .setImageUrl(MonitorIconUrl));

        monitorCard
            .addSection(this.buildToolbarSection())
            .addSection(this.buildMonitorSection());

        return monitorCard.build();
    }

    private buildToolbarSection(): GoogleAppsScript.Card_Service.CardSection {
        return CardService.newCardSection()
            .addWidget(CardService.newButtonSet()
                .addButton(CardService.newImageButton()
                    .setIconUrl(RefreshIconUrl)
                    .setAltText("Refresh")
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName(goToPlanMonitor.name)))
                .addButton(CardService.newImageButton()
                    .setIconUrl(SetupIconUrl)
                    .setAltText("Setup")
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName(goToSetup.name)))
                .addButton(CardService.newImageButton()
                    .setIconUrl(HelpDeskIconUrl)
                    .setAltText("Help Desk")
                    .setOpenLink(CardService.newOpenLink()
                        .setUrl("https://paycheckplanner.armatlab.com/index.php?a=add&catid=3")
                        .setOpenAs(CardService.OpenAs.OVERLAY)
                        .setOnClose(CardService.OnClose.NOTHING))));
    }

    private buildMonitorSection(): GoogleAppsScript.Card_Service.CardSection {


        var monitorSection: GoogleAppsScript.Card_Service.CardSection = CardService.newCardSection();

        var validatedSetup: SetupModel = SetupModel.load();

        if (validatedSetup.isValid()) {

            var calendarEvents = this.importEvents(
                validatedSetup.Calendar,
                this.utcToLocal(validatedSetup.FromDate),
                this.utcToLocal(validatedSetup.ToDate));

            if (calendarEvents && calendarEvents !== null && calendarEvents.length > 0) {
                this.generateProjection(monitorSection, calendarEvents, validatedSetup.InitialBalance);
            } else {
                monitorSection.addWidget(CardService.newTextParagraph().setText("No events found"));
            }

        } else {
            monitorSection.addWidget(CardService.newTextParagraph()
                .setText("Error(s): " + validatedSetup.errors.join(", ")));
        }


        return monitorSection;
    }

    private generateProjection(monitorSection: GoogleAppsScript.Card_Service.CardSection, calendarEvents: EventCost[], amountAtHand: number) {

        var runningAmountAtHand: number = amountAtHand;

        monitorSection.addWidget(CardService.newKeyValue()
            .setContent("Initial Balance: " + this.moneyFormatter.format(amountAtHand)));

        calendarEvents.forEach(event => {

            runningAmountAtHand = runningAmountAtHand + event.cost;

            var topLabel: string = this.dateFormatter.format(event.event.getStartTime());

            var bottomLabel: string =
                "Value: " + this.moneyFormatter.format(event.cost) +
                ", New Balance: " + this.moneyFormatter.format(runningAmountAtHand);

            var iconUrl: string = FlatIconUrl;

            if (event.cost > 0) {
                iconUrl = UpIconUrl;
            }

            if (event.cost < 0) {
                iconUrl = DownIconUrl;
            }

            if (runningAmountAtHand < (amountAtHand * .2)) {
                iconUrl = WarningIconUrl;
            }

            if (runningAmountAtHand < 0) {
                iconUrl = CriticalIconUrl;
            }

            if (event.cost < 0) {
                monitorSection.addWidget(CardService.newKeyValue()
                    .setIconUrl(iconUrl)
                    .setTopLabel(topLabel)
                    .setContent(event.event.getTitle())
                    .setBottomLabel(bottomLabel));
            } else if (event.cost > 0) {
                monitorSection.addWidget(CardService.newKeyValue()
                    .setIconUrl(iconUrl)
                    .setTopLabel(topLabel)
                    .setContent(event.event.getTitle())
                    .setBottomLabel(bottomLabel));
            } else {
                monitorSection.addWidget(CardService.newKeyValue()
                    .setIconUrl(iconUrl)
                    .setTopLabel(topLabel)
                    .setContent(event.event.getTitle()));
            }
        });
    }

    /*
    Due to the trick of the date input HTML5 controls
    that return values as UTC with no regard to the browser's loca timezone offset
    I have to convert the perceived UTC into the actual local time
    */
    private utcToLocal(utcDateTime: Date) {
        if (utcDateTime && utcDateTime !== null) {
            var newStartTime = new Date();
            newStartTime.setFullYear(utcDateTime.getUTCFullYear());
            newStartTime.setMonth(utcDateTime.getUTCMonth());
            newStartTime.setDate(utcDateTime.getUTCDate());
            newStartTime.setHours(utcDateTime.getUTCHours());
            newStartTime.setMinutes(utcDateTime.getUTCMinutes());
            newStartTime.setSeconds(utcDateTime.getUTCSeconds());
            newStartTime.setMilliseconds(utcDateTime.getUTCMilliseconds());
            return newStartTime;
        } else {
            return null;
        }
    }

    /////////////////////// EVENT IMPORT //////////////////////////

    private importEvents(
        calendar: GoogleAppsScript.Calendar.Calendar,
        startDate: Date,
        endDate: Date,
        ignoreZeroCosts: boolean = false): EventCost[] {

        Logger.log([
            { "calendar": calendar.getName() },
            { "Start Date": startDate },
            { "End Date": endDate },
            { "Ignore Zero Costs": ignoreZeroCosts }
        ]);

        // set hours to capture all events for the start and end days
        startDate.setHours(0, 0, 0);
        endDate.setHours(23, 59, 59);

        var events: GoogleAppsScript.Calendar.CalendarEvent[] = calendar.getEvents(startDate, endDate);
        Logger.log("Event count: " + events.length);

        var result = new Array<EventCost>();
        for (var counter = 0; counter < events.length; counter++) {
            var event = events[counter];
            // Logger.log(event.getStartTime() + " : " + event.getTitle() + " : " + this.getEventCost(event));
            if (!ignoreZeroCosts || (ignoreZeroCosts && this.getEventCost(event) !== 0)) {
                result.push(new EventCost(event, this.getEventCost(event)));
            }
        }

        return result;
    }

    private getEventCost(event: GoogleAppsScript.Calendar.CalendarEvent): number {
        var title: string = event.getTitle().trim().toLowerCase();
        var description: string = event.getDescription().trim().toLowerCase();
        var payload: string = title + ' ' + description;

        var expense: number = this.findAndEvaluate("-", payload);
        Logger.log("Event expense:" + expense);
        if (expense < 0) {
            return expense;
        }

        var income: number = this.findAndEvaluate("+", payload);
        Logger.log("Event income:" + income);
        if (income > 0) {
            return income;
        }

        return 0;
    }

    private findAndEvaluate(currencySymbol: string, searchInText: string): number {
        if (searchInText.indexOf(currencySymbol) >= 0) {
            var words = searchInText.split(' ');
            Logger.log("Payload: " + words);

            for (var index: number = 0; index < words.length; index++) {
                var word = words[index];
                Logger.log([
                    { "Loop:": index },
                    { "Evaluating:": word }
                ]);

                if (word && word.length > currencySymbol.length &&
                    word.substr(0, currencySymbol.length) === currencySymbol) {
                    var twoPlacedFloat: number = Number.parseFloat(word);

                    if (!isNaN(twoPlacedFloat)) {
                        return twoPlacedFloat;
                    }
                }
            }
        }

        return 0;
    }
}