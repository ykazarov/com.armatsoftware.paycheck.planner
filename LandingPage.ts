import * as navigator from "./navigation/navigator"

export class LandingPage {

    public BuildCard(): GoogleAppsScript.Card_Service.Card {
        var landingCard = CardService.newCardBuilder()
            .addSection(CardService.newCardSection()
                .setHeader("User Guide")
                .addWidget(CardService.newTextParagraph().setText("Begin with the quick guide on how to use this tool. " +
                    "New videos will be added here so make sure to periodically check for new content"))
                .addWidget(CardService.newTextButton()
                    .setText("User Guide")
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName(goToUserGuide.name))))
            .addSection(CardService.newCardSection().setHeader("Setup")
                .addWidget(CardService.newTextParagraph()
                    .setText("Set up your parameters before starting to monitor and plan your expenses. " +
                        "By now, you should have followed the user guide videos and plugged in some amounts into your calendar events"))
                .addWidget(CardService.newTextButton()
                    .setText("Setup")
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName(goToSetup.name))))
            .addSection(CardService.newCardSection()
                .setHeader("Plan and Monitor")
                .addWidget(CardService.newTextParagraph()
                    .setText("Monitor existing expenses and plan by adding future events with expected impact to your budget"))
                .addWidget(CardService.newTextButton()
                    .setText("Plan and Monitor")
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName(goToPlanMonitor.name))))
            .addSection(CardService.newCardSection().setHeader("Support Us")
                .addWidget(CardService.newTextParagraph().setText("Has this tool helped you save and better plan your expenses? Please support us!"))
                .addWidget(CardService.newTextButton()
                    .setText("Donate")
                    .setOpenLink(CardService.newOpenLink()
                        .setUrl("https://paypal.me/pools/c/8oH7KVtPIa")
                        .setOpenAs(CardService.OpenAs.OVERLAY)
                        .setOnClose(CardService.OnClose.NOTHING)
                    )));

        return landingCard.build();
    }
}