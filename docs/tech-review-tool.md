# Tech Review Tool

The automated Tech Review Tool is run against the game on CAGE and helps to identify:

* **No unauthorised network requests**:
All network requests made by the game must be within the game's root directory. No requests to other domains, or other top-level directories are
allowed. This is to enable the game to function offline in the app.

* **No cachebusting**:
No assets should be cachebusted in released files.

* **Correctly formatted file names**:
Assets and release files must be lowercase and only contain alphanumerical characters, underscores ( _ ) and dashes ( - ).

* **iStats calls**:
The game must send 'action_name=game_loaded' once, when the game is loaded. (See [Stats](stats.md) for more information).

* **Language use**
An automated check will scan the source code for a list of disallowed words, and flag up any words used with their line numbers. Code should also be manually checked for any unlisted words.

  * No inappropriate language such as swear words
  * No advertising
  * No links to products in software licenses
  * No names of people or companies (this may need checking manually)

## Information for Users

### A note on caching
Chrome cache MUST be enabled in order to accurately test with this tool. In order to do this, please ensure that 'Disable cache' is NOT checked within the network tab in your developer tools.

### Installation

Install the [BBC Digital Children's Games Tech Review Tool](https://chrome.google.com/webstore/detail/bbc-digital-childrens-gam/obhojgkahkhapohjnijhehgfkpceogcb) from the Google Web Store.


### Using the Extension

* Visit a game webpage that requires a technical review (In the format: http://www.bbc.co.uk/games/embed/{GID}?versionOverride={version}&viewNonPublished=true)
* Open developer tools and click on Tech Review tab

For accurate results:

* Ensure cache is not disabled in dev tools.
* Click the "Reload and Run" button. This will clear the cache, reload the page, and run the checks for every request.
