//TODO can we remove "key" and just use the object's key?
interface GelDefaults {
    [key: string]: { group: string; title: string; key: string; ariaLabel: string };
}

const config: GelDefaults = {
    exit: {
        group: "topLeft",
        title: "Exit",
        key: "exit",
        ariaLabel: "Exit Game",
    },
    home: {
        group: "topLeft",
        title: "Home",
        key: "home",
        ariaLabel: "Home",
    },
    achievements: {
        group: "bottomLeft",
        title: "Achievements",
        key: "achievements",
        ariaLabel: "Your Achievements",
    },
    howToPlay: {
        group: "bottomRight",
        title: "How To Play",
        key: "how-to-play",
        ariaLabel: "Game Instructions",
    },
    play: {
        group: "middleCenterV",
        title: "Play",
        key: "play",
        ariaLabel: "Play Game",
    },
    settings: {
        group: "topRight",
        title: "Settings",
        key: "settings",
        ariaLabel: "Game Settings",
    },
    audioOff: {
        group: "topRight",
        title: "Sound Off",
        key: "audio-off",
        ariaLabel: "Disable Sound",
    },
    audioOn: {
        group: "topRight",
        title: "Sound On",
        key: "audioOn",
        ariaLabel: "Enable Sound",
    },
    previous: {
        group: "middleLeft",
        title: "Previous",
        key: "previous",
        ariaLabel: "Previous Item",
    },
    next: {
        group: "middleRight",
        title: "Next",
        key: "next",
        ariaLabel: "Next Item",
    },
    continue: {
        group: "bottomCenter",
        title: "Continue",
        key: "continue",
        ariaLabel: "Continue Game",
    },
    restart: {
        group: "bottomCenter",
        title: "Restart",
        key: "restart",
        ariaLabel: "Restart Game",
    },
    back: {
        group: "topLeft",
        title: "Back",
        key: "back",
        ariaLabel: "Back",
    },
    pause: {
        group: "topRight",
        title: "Pause",
        key: "pause",
        ariaLabel: "Pause Game",
    },
};

export default config;
