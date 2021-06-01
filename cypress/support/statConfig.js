/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
/*
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
 */

export const statBuckets = {
    testCbeebies: "598264",
    testCBBC: "598262",
    testGames: "599454",
    prodCbeebies: "598263",
    prodCBBC: "598261",
    prodGames: "599452",
};

export const userActions = {
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
    },
    clickExit: {
        campaignId: "Page",
        creationId: "exit~click",
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
    achievementsOpen: {
        campaignId: "Page",
        creationId: "achievements~open",
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
    achievementsClose: {
        campaignId: "Page",
        creationId: "achievements~close",
        variant: "",
        format: "",
        generalPlacement: "keepalive.games.genie",
        detailedPlacement: "",
        advertiserId: "",
        url: "unknown",
        countername: "keepalive.games.genie",
        screenName: "achievements",
        bucket: "",
        event: "user_action",
    },
    selectItem: {
        campaignId: "Page",
        creationId: "" /* [element]~select */,
        variant: "",
        format: "" /* ELE=[element] */,
        generalPlacement: "keepalive.games.genie",
        detailedPlacement: "",
        advertiserId: "",
        url: "unknown",
        countername: "keepalive.games.genie",
        screenName: "" /* Passed in at runtime */,
        bucket: "",
        event: "user_action",
    },
    playAgain: {
        campaignId: "Page",
        creationId: "level~playagain",
        variant: "",
        format: "",
        generalPlacement: "keepalive.games.genie",
        detailedPlacement: "",
        advertiserId: "",
        url: "unknown",
        countername: "keepalive.games.genie",
        screenName: "results",
        bucket: "",
        event: "user_action",
    },
    levelContinue: {
        campaignId: "Page",
        creationId: "level~continue",
        variant: "",
        format: "",
        generalPlacement: "keepalive.games.genie",
        detailedPlacement: "",
        advertiserId: "",
        url: "unknown",
        countername: "keepalive.games.genie",
        screenName: "results",
        bucket: "",
        event: "user_action",
    },
    levelPlayagain: {
        campaignId: "Page",
        creationId: "level~playagain",
        variant: "",
        format: "",
        generalPlacement: "keepalive.games.genie",
        detailedPlacement: "",
        advertiserId: "",
        url: "unknown",
        countername: "keepalive.games.genie",
        screenName: "results",
        bucket: "",
        event: "user_action",
    },
    narrativeContinue: {
        campaignId: "Page",
        creationId: "narrative~continue",
        variant: "",
        format: "",
        generalPlacement: "keepalive.games.genie",
        detailedPlacement: "",
        advertiserId: "narrative-narrative",
        url: "unknown",
        countername: "keepalive.games.genie",
        screenName: "narrative",
        bucket: "",
        event: "user_action",
    },
    narrativeSkip: {
        campaignId: "Page",
        creationId: "narrative~skip",
        variant: "",
        format: "",
        generalPlacement: "keepalive.games.genie",
        detailedPlacement: "",
        advertiserId: "narrative-narrative",
        url: "unknown",
        countername: "keepalive.games.genie",
        screenName: "narrative",
        bucket: "",
        event: "user_action",
    },
    shopBuy: {
        campaignId: "Page",
        creationId: "shopbuy~click",
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
    shopManage: {
        campaignId: "Page",
        creationId: "shopmanage~click",
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
    shopPurchase: {
        campaignId: "Page",
        creationId: "buy~click",
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
    shopEquip: {
        campaignId: "Page",
        creationId: "equip~click",
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
    shopUse: {
        campaignId: "Page",
        creationId: "use~click",
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
    exitGame: {
        campaignId: "Page",
        creationId: "exit~click",
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
    achievementComplete: {
        campaignId: "Page",
        creationId: "achievement~complete",
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
    levelSelect: {
        campaignId: "Page",
        creationId: "level~select",
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
    displayScore: {
        campaignId: "Page",
        creationId: "score~display",
        variant: "",
        format: "",
        generalPlacement: "keepalive.games.genie",
        detailedPlacement: "",
        advertiserId: "Test%20Level%201",
        url: "unknown",
        countername: "keepalive.games.genie",
        screenName: "",
        bucket: "",
        event: "user_action",
    },
};

export const pageViews = {
    homePage: {
        countername: "keepalive.games.genie",
        screenName: "home",
        bucket: "",
        event: "page",
    },
    selectScreenPage: {
        countername: "keepalive.games.genie",
        screenName: "character_select",
        bucket: "",
        event: "page",
    },
    resultsScreenPage: {
        countername: "keepalive.games.genie",
        screenName: "results",
        bucket: "",
        event: "page",
    },
    narrativePage: {
        countername: "keepalive.games.genie",
        screenName: "narrative",
        bucket: "",
        event: "page",
    },
    shopPage: {
        countername: "keepalive.games.genie",
        screenName: "shopmenu",
        bucket: "",
        event: "page",
    },
    shopStore: {
        countername: "keepalive.games.genie",
        screenName: "shopbuy",
        bucket: "",
        event: "page",
    },
    shopManagement: {
        countername: "keepalive.games.genie",
        screenName: "shopmanage",
        bucket: "",
        event: "page",
    },
    levelSelectPage: {
        countername: "keepalive.games.genie",
        screenName: "level_select",
        bucket: "",
        event: "page",
    },
};
