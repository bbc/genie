# BASISU Plugin Dev Plan
## TASKS
* Investigate Auto padding
* Investigate quality settings
  * Convert the Genie repo to basisu - should this be the case going forward?
  * UASTC seems better for alpha
* Investigate split alpha
* Unit Tests
* Will this work when built? Does babel transform import meta need to be set differently outside jest?

## Completed Tasks
* Fix url part
* Remove multiple load callbacks
* Use Phaser data instead of basis loader xhr loader
* Correct flip - fixed in generation using `-y_flip`
* Should the Basis Loader be initialised in the plugin and passed to basisu file? _(This might resulty in only one worker)_
* * Remove hard coded loads _(Switched to imports instead)