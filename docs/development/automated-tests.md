# Automated Tests

## Automated test pack for Genie

The BBC has developed an automated test pack which is used to ensure the game meets some of our technical requirements and the main paths through the game are not broken in order to help reduce the time it takes Genie games to pass certification. The test pack will be executed when the release candidate build of the game component is handed over for certification; A list of test coverage can be found below. It is worth noting that the achievements component is configurable, and although there are tests around achievements listed below. If achievements are not part of the game component these tests will be de-scoped - similary for any custom settings.

## Breaking changes to avoid

The automated framework has been developed to test any of the flows / buttons which come bundled with the Genie-starter-pack. Therefore removing any of these elements, changing their IDs in the DOM or changing the name of the components throughout genie will cause the automated framework to fail. Examples of this are as follows;

Changing the name of the `home` component to `title`. Any elements within this component will therefore have their Ids changed. For instance the play button would change from `home__play` to `title__play` in the DOM. As the automated framework is searching to find an element with the Id `home__play`, almost every test in the automated pack would fail as the play button on the title screen is necessary to test almost all of the flows through the game.

Changing the Id of a specific button. The `how-to-play` button for instance is present on multiple components within genie. If this was therefor to be changed to something other than `how-to-play` e.g. `howToPlay`, any tests which need to interact with this element on any component will fail. 

## Automated test coverage

|Test|
|-------------------------------------------------------------------------------|
|The game flows from the loading screen to the Gameplay component in the correct order|
|The home screen loads and displays all of the correct elements|
|The character select screen loads and displays all of the correct elements|
|The how to play screen loads and displays all of the correct elements|
|The pause screen loads and displays all of the correct elements when accessed from the select screen|
|The gameplay screen loads and displays all of the correct elements|
|The pause screen loads and displays all of the correct elements when accessed from the gameplay screen|
|The achievements screen is accessible via  the home screen|
|The achievements screen is accessible via the character select screen|
|Audio settings are saved to the GMI |
|Motion settings are saved to the GMI |
|Custom settings are saved to the GMI |
|There are no files in the game source code which exceed the maximum file size(10MB)|
|Any audio file within the game source code is in both .ogg & .mp3 file formats|
|There is a build file contained within the game source code repository|
|The Audio toggle can be toggled on & off|
|The settings can be changed from the settings screen|
|Once the game has loaded, there are no console errors|
|Once the game has loaded, there are no console logs|
|The local storage key follows the correct format for the game save data|