import { UserGuidePage } from "../UserGuidePage";
import { SetupPage } from "../SetupPage";
import { PlanMonitorPage } from "../PlanMonitorPage";

function goToPlanMonitor() {
    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation()
            .popToRoot()
            .pushCard(new PlanMonitorPage().BuildCard()))
        .build();
}

function goToSetup() {
    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation()
            .popToRoot()
            .pushCard(new SetupPage().BuildCard()))
        .build();
}

function goToUserGuide() {
    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation()
            .popToRoot()
            .pushCard(new UserGuidePage().BuildCard()))
        .build();
}