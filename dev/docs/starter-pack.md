# Starter Pack Release Process

There are two protected branches on the starter pack repo:  

**master** - Released version of starter pack, the jenkins jobs that create repos for games use this branch.  

**develop** - The branch to develop on, and also the branch that the CI pushes theme/docs updates to.

The develop branch should be tested by QA before being merged to master.

`main.js` in the starter pack pulls in the game component from the genie dependency in the `node_modules` folder.

There is a placeholder game file in the starter pack which is not used, but there are comments on how to use the placeholder file instead of the example game.


## Jenkins

There are three CI jobs for the starter pack:

**genie-release** - this should run when a new genie release has been made, it triggers the copy job.

**genie-starter-pack-copy** - this should copy files from the genie core into the starter pack develop branch.

The copy job in jenkins does the following:  
- Updates the package.json to the latest released version of Genie Core.
- Copies theme config and documentation into the starter pack.
- Commits and pushes these to the develop branch.

**genie-starter-pack-develop** - this builds the develop branch version of the starter pack, so that it can be viewed on CAGE.

## CAGE URLs

Starter Pack (master branch): https://www.test.bbc.co.uk/games/embed/genie-starter-pack?versionOverride=latest&viewNonPublished=true  

Starter Pack (develop branch): https://www.test.bbc.co.uk/games/embed/genie-starter-pack-develop?versionOverride=latest&viewNonPublished=true