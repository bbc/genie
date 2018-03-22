# Coding Guidelines

## Code Format

### Basics (line lengths, spaces vs tabs, semi-colons etc)

These are enforced via [Prettier](https://github.com/prettier/prettier) and [ESLint](https://eslint.org/).

Prettier and ESLint plugins are available for most IDEs, or can be run from the command line.
Code checked into source control should be run though Prettier first to prevent extraneous diff lines.

Check the **/.prettierrc** and **/eslintrc.json** files for rule specifics.

For code autocompletion, [TernJS](http://ternjs.net/) may be used.

### Doc Comments

Doc comments should be added where they will be helpful to explain the API. Docs are generated using [JSDoc](https://usejsdoc.org/) and will appear in the `docs/api` folder.

#### JSDoc Example

```JAVASCRIPT
/**
 * this is MyClass.
 */
export default class MyClass {
  /**
   * @param {number} a - this is a value.
   * @param {number} b - this is a value.
   * @return {number} result of the sum value.
   */
  sum(a, b){
    return a + b;
  }
}
```

## Branching Strategy

All code should be created in feature branches.
*Is this enough or are we likely to need a work branch between feature and master?*

### Exceptions:

*Documentation? Could possibly just be checked into master assuming it sits in the docs folder?*

### How to merge

* Merge the main branch into your feature branch (to ensure there are no conflicts).
* Push your feature branch to Github.
* Create a pull request.
* Inform your team there is a pull request (PR) ready for review.
* Implement/discuss any requested changes from the review. 
* Once the PR has been approved, it will need to go through the post-amigo process. Inform a BA and QA team member to start this process.
* A dev can then merge the branch into master when the QA process has passed.

## Deployment Strategy

When a commit to master is made, the [Jenkins job](https://ci-games.tools.bbc.co.uk/job/childrens-games-genie/) will automatically build to [CAGE](https://www.bbc.co.uk/cbeebies/embed/game/childrens-games-genie?versionOverride=latest&viewNonPublished=true).