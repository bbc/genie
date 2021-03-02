// eslint-disable-next-line no-unused-vars
const exampleSpec = {
    campaignId: "", //container "Page" by default TODO make building the stat make this Page if left blank
    creationId: "", //action_name~action_type
    variant: "", // experiment
    format: "", // metadata TODO make this is a variable which could change - pass in on buildStat. this takes a value and can by overwritten at test time.
    generalPlacement: "", // counterName
    detailedPlacement: "", // hid.
    advertiserId: "", // content id / level id TODO make this as a variable as it could change.
    url: "", // "unknown" by default TODO set this to unknown if left empty
    counterName: "[keepalive.games.genie]", // counterName from iSite
    screenname: "page", // Screen / page (Only used on page view stats). If this is blank, build generalPlacement without .screenName
    bucket: "testCBBC", // bucket stats should go into e.g. testCBBC, testCbeebies, testGames, prodCBBC, prodCbeebies, prodGames
    event: "page", // For page views, this will be view. For user actions, for user events this will be userAct.
  };
  
  export const statBuckets = {
    testCbeebies: "598264",
    testCBBC: "598262",
    testGames: "599454",
    prodCbeebies: "598263",
    prodCBBC: "598261",
    prodGames: "599452",
  };
  
  export const statSpec = {
    recommendations1_page: {
      counterName: "",
      screenName: "",
      bucket: "",
      event: "",
    },

    gameloaded: {
      campaignId: "Page",
      creationId: "gameloaded~true",
      variant: "",
      format: "",
      generalPlacement: "keepalive.games.genie",
      detailedPlacement: "",
      advertiserId: "",
      url: "unknown",
      countername: "keepalive.games.genie",
      screenName: "",
      bucket: "",
      event: "user_action",
    },
    clickPlay: {
      campaignId: "Page",
      creationId: "play~click",
      variant: "",
      format: "",
      generalPlacement: "keepalive.games.genie",
      detailedPlacement: "",
      advertiserId: "",
      url: "unknown",
      countername: "keepalive.games.genie",
      screenName: "home",
      bucket: "",
      event: "user_action",
    },
    clickHowtoplay: {
      campaignId: "Page",
      creationId: "howtoplay~click",
      variant: "",
      format: "",
      generalPlacement: "keepalive.games.genie",
      detailedPlacement: "",
      advertiserId: "",
      url: "unknown",
      countername: "keepalive.games.genie",
      screenName: "home",
      bucket: "",
      event: "user_action",
    }
  };
  