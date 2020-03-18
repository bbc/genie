# Genie Examples Launcher

The examples launcher page is available when _debug=true_ is added to the url.
Buttons are automatically added to the launcher page for any routes added to _src/core/get-debug-screens.js_

## Adding a new example

1.  Add a named route for the screen to _src/core/get-debug-screens.js_
2.  Add a named config json5 file for the screen to _themes/default/config/examples_
3.  Add those files to _themes/default/config/files.json_
4.  Try to keep any required assets in the _themes/default/examples_ folder so they are easy to delete
