import { startup } from "./core/startup.js";
import { settings } from "./core/settings.js";

settings.setCloseCallback(() => {
    //Called when settings screen has been closed
    console.log("Settings Closed");
});

const settingsConfig = {
    pages: [
        {
            title: "Global Settings",
            settings: [
                {
                    key: "audio",
                    type: "toggle",
                    title: "Audio",
                    description: "Turn off/on sound and music",
                },
                {
                    key: "custom1",
                    type: "toggle",
                    title: "Custom 1",
                    description: "Switch custom message",
                },
            ],
        },
    ],
};

settings.add("custom1", value => {
    //Example of custom setting callback
    console.log("custom 1 setting changed to: " + value);
});

startup(settingsConfig);
