# Developing a Gameplay Component

* [How is Genie structured?](#how-is-genie-structured)
* [How do I use the core engines?](#how-do-i-use-the-core-engines)
* [What coding and test standards do I need to apply?](#what-coding-and-test-standards-do-i-need-to-apply)
* [How does my component plug into Genie?](#how-does-my-component-plug-into-genie)
* [How do I test my component in the Genie framework?](#how-do-i-test-my-component-in-the-genie-framework)
* [Are there any areas of existing Children’s game delivery standards I need to apply?](#user-content-are-there-any-areas-of-existing-childrens-game-delivery-standards-i-need-to-apply)
* [How do I get my build onto Children’s platforms?](#how-do-i-get-my-build-onto-children’s-platforms)
* [What acceptance tests will the BBC carry out?](#what-acceptance-tests-will-the-bbc-carry-out)
* [What documentation do I need to supply?](#what-documentation-do-i-need-to-supply)


## How is Genie structured?

Genie is a modular framework which provides a set of reusable components (known as "screens") which are common across all BBC games, as well as various core "engines", which handle GEL buttons, layout and accessibility.

The current screens are:

- Home
- How to Play (overlay)
- Pause (overlay)
- Select
- Results

These screens can be selected and used in any order, with your gameplay component sitting between the built in screens. An example flow may be a Home Screen that leads to a level Select screen, which then leads to your gameplay component, which finally outputs scores in a Results screen.

The game flow sequence can be configured by editing: `src/main.js`.  
Import the desired screens and list them in the `screenConfig` object.  
The `routes` object for each gives a list of possible onward journeys.

## How do I use the core engines?

Full API documentation for the engines can be found within the Genie core repository. **Any files in Genie core should be used as provided, and must not be copied or modified in any way.** A short overview of their functionality follows.

### Screen

The screen module handles the positioning and layout of GUI elements. Standard GEL GUI elements are already known to the screen module and can be set up and positioned correctly very simply. The screen module also instantiates the scaler and provides methods for adding display objects to foreground and background (It is expected that most of a game would be added to the background group and any overlays, HUD would go in the foreground group). Buttons added using this method will automatically call the correct functions and be screen-reader and tab accessible.

An example of the factory function for making gel layouts:

`this.setLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);`

## What coding and test standards do I need to apply?

We use ESLint with a slightly edited ruleset, along with Prettier. For non-gameplay screens we require that this standard is adhered to, along with unit test coverage. Prettier and ESLint plugins are available for most IDEs, or can be run from the command line.

For gameplay components themselves we allow greater flexibility and as long as the code meets the BBC standard requirements such as not producing console errors, most styles are allowed. Feel free to use our eslint standards, however. Our eslint configuration file can be found in the root of the project as `.eslintrc_`. Rename it to `.eslintrc` to use it.

We will also use the [Tech Review Tool](../tech-review-tool.md) to ensure your game is BBC compliant.


## How does my component plug into Genie?

All components extend the Genie "Screen" class. The `Screen` class extends `Phaser.Scene`, providing the `Context` to objects that extend from it. Once your game component extends Screen and has functionality, import your component into main as you would any other screen, and add it into the sequence at the desired point.


## How do I test my component in the Genie framework?

You can preview your game without bundling it through Webpack by running it in a live server using `npm start`, and viewing it in a browser at http://localhost:8080/.

The `debug=true` query string may be added to the end to view the game in QA Mode. This gives additional console output, and if you press "q", you can see the layout overlay. http://localhost:8000/?debug=true.

To build your game using Webpack, use `npm run build`.

To quickly view a specific theme, you can access it using the querystring 'theme': http://localhost:8080/?theme=<themeName>.

**Please note that an `index.html` file has been provided for local development. This will not be used in production.**

## Are there any areas of existing Children’s game delivery standards I need to apply?

Please supply unminified/unfobfuscated source code with a working build process.

All paths everywhere in the project must be relative so that the project compiles on any machine.

The game should not contain commented out code or TODOs. If something is marked as "TODO" then it either legitimately needs doing in which case the project isn't finished, or it's non-essential and should be removed.

Libraries used should be versioned and not modified. Assets containing text/sentences/paragraphs should be avoided except for cases where single characters or digits are used (e.g. for titles).

No assets or CSS should fail to load.

The console should contain no console.log or errors from the game. It should also suppress any logs from libraries.

The project shouldn't contain any hidden files (`.DS_STORE` or similar).

The game must load in under 15 seconds when emulating the average 3G connection with custom 3G emulation. The throttling values should be set to: Throughput: 5120Kb/s (=5Mb/s), Latency: 64ms.

The project should contain no unused files or backups, including:
  * Unused files e.g. "test_level.js"
  * Backups e.g. "loading.js.BU"
  * Versioned files e.g. "boy_v2_final.png"
  * Arbitrarily-named files e.g. "assets_dan.json"

## How do I get my build onto Children’s platforms?
Every time a commit is made to the repository, our Jenkins job will build the game to our Children's Game Embed (CAGE) page. You will get email notifications with status reports on success/failure of any automated builds. In the event of a failure you should get an error report with debug information.

The CAGE URL will be in the following format (replace the parts in curly braces with your game information):

<pre>https://www.bbc.co.uk/cbeebies/embed/game/{game-id}?versionOverride={jenkins-build-number}&viewNonPublished=true</pre>

You can also replace the **{jenkins-build-number}** with the string `latest` to see the latest build.

There will be a separate game id for each theme (this will need to be set up by a member of our team here at the BBC).

## What acceptance tests will the BBC carry out?

The BBC will carry out the standard tests and compliance testing carried out on all games as outlined in the contracts.

Please see the [Genie Testing Guide](../testing.md)

## What documentation do I need to supply?

You will need to provide us with documentation outlining how to re-theme your gameplay component, how to replace the assets with new ones, and how to build and run your component from source code.

