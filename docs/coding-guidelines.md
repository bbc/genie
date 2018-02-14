# Coding Guidelines

## Code Format

### Basics (line lengths, spaces vs tabs, semi-colons etc)

These are enforced via [prettier](https://github.com/prettier/prettier) and [tslint](https://palantir.github.io/tslint/).

Prettier and TSLint plugins are available for most IDEs or can be run from the commandline.
Code checked into source control should be run though prettier first to prevent extraneous diff lines.

Check the **/.prettierrc** and **/tslint.json** files for rule specifics.

### Interfaces
Interfaces that need to be shared between modules should go in a separate file in the 'types' sub folder.
Interfaces should not be prefixed as per TS guidelines:

>In general, you shouldn’t prefix interfaces with I (e.g. IColor). Because the concept of an interface in TypeScript is much more broad than in C# or Java, the IFoo naming convention is not broadly useful.

### Doc Comments
Doc comments should be added where they will be helpful to explain the API.
Docs are generated using Typedoc and placed in the docs/api folder

#### Typedoc Example

```JAVASCRIPT
/**
 * Create a new GEL layout manager for a given Genie {@link Screen}
 * Called in the create method of a given screen
 *
 * @example
 * this.layout = this.context.gel.createLayout(this, ["home", "restart", "continue", "pause"], sfx);
 *
 * @param screen - The Genie Screen that will be managed by this instance
 * @param buttons - array of standard button names to include. See {@link ./config.ts} for available names
 * @param sfx - Map of all the audio sprites
 * @param soundButton - enable or disable the audio buttons @todo could be parts of the buttons array
 */
function createLayout(screen: Screen, buttons: string[], sfx: Phaser.AudioSprite, soundButton?: boolean): Layout {
    return new Layout(
        game,
        screen,
        scaler,
        addToBackground,
        accessibilityManager,
        keyLookup,
        buttons,
        sfx,
        soundButton,
    );
}
```

### Tests

* Avoid using beforeEach / afterEach unless they actually reduce duplication and simplify the code.
 (In general they make the code more complicated and less cohesive.)

## Branching Strategy
All code should be created in feature branches.
*Is this enough or are we likely to need a work branch between feature and master?*

### Exceptions:
*Documentation? Could possibly just be checked into master assuming it sits in the docs folder?*

### How to merge
* Merge the Main branch into your feature branch (to make sure there will be no conflicts in a pull request)
* Push your feature branch to github.
* Create a Pull Request
* Inform your team there is a PR ready to review
* Implement any requested changes from the review. 
* Once the PR has been approved it will need to go through the Post-Amigo process. Inform a BA and QA team member to start this process.
* QA will merge the branch if everything is ok and let you know.

## Deployment Strategy

*stub*