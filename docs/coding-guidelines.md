# Coding Guidelines

## Code Format

### Basics (line lengths, spaces vs tabs, semi-colons etc)

These are enforced via [prettier](https://github.com/prettier/prettier) and [tslint](https://palantir.github.io/tslint/).

Prettier and TSLint plugins are available for most IDEs or can be run from the commandline.
Code checked into source control should be run though prettier first to prevent extraneous diff lines.

Check the **/.prettierrc** and **/tslint.json** files for rule specifics.

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