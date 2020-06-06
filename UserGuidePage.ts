const UserGuideIconUrl = "https://github.com/ykazarov/Com.ArmatSolutions.Paycheck.Planner/blob/master/assets/icons/ic_map_black_24dp.png?raw=true";

export class UserGuidePage {

    public BuildCard() {
        var userGuideCard = CardService.newCardBuilder()
          .setName("User Guide")
          .setHeader(CardService.newCardHeader()
            .setTitle("User Guide")
            .setImageUrl(UserGuideIconUrl)
            .setImageAltText("user guide"));
      var userGuidePage = new UserGuidePage();
        userGuideCard.addSection(this.BuildTrainingSection());
      
        return userGuideCard.build();
      }

      private BuildTrainingSection(): GoogleAppsScript.Card_Service.CardSection {
        return CardService.newCardSection()
            .addWidget(CardService.newTextButton()
            .setText("What is Paycheck Planner?")
            .setOpenLink(CardService.newOpenLink()
                .setUrl("https://paycheckplanner.armatlab.com/knowledgebase.php?article=1")
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.NOTHING)
            ))
            .addWidget(CardService.newTextButton()
            .setText("Who should use Paycheck Planner")
            .setOpenLink(CardService.newOpenLink()
                .setUrl("https://paycheckplanner.armatlab.com/knowledgebase.php?article=2")
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.NOTHING)
            ))
            .addWidget(CardService.newTextButton()
            .setText("How to Use Paycheck Planner")
            .setOpenLink(CardService.newOpenLink()
                .setUrl("https://paycheckplanner.armatlab.com/knowledgebase.php?article=5")
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.NOTHING)
            ))
            .addWidget(CardService.newTextButton()
            .setText("Setup")
            .setOpenLink(CardService.newOpenLink()
                .setUrl("https://paycheckplanner.armatlab.com/knowledgebase.php?article=3")
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.NOTHING)
            ))
            .addWidget(CardService.newTextButton()
            .setText("Plan and Monitor")
            .setOpenLink(CardService.newOpenLink()
                .setUrl("https://paycheckplanner.armatlab.com/knowledgebase.php?article=4")
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.NOTHING)
            ));
    }
}