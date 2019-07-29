# Upgrade Notes

## Genie 2.0.2
Screens now automatically pass their transientData to the next screen.
Previously data needed to be passed as a parameter to the navigation routes e.g:

```javascript
this.navigation.next(data)
```
Instead now the data should be mutated in place by changing `this.transientData`

## Genie 2.0.1
`"genie": "git+ssh://git@github.com/bbc/childrens-games-genie.git#v2.0.1"`

Genie 2.0.1 adds support for the achievements system.
If this is enabled, some assets need to be loaded by the game (achievements button / indicator / sound).
These will need to be copied from the starter pack to your theme folder:

https://github.com/bbc/childrens-games-genie-starter-pack/tree/master/themes/default/gel

* themes/#####/gel/desktop/notification.mp3
* themes/#####/gel/desktop/notification.png
* themes/#####/gel/mobile/notification.png
* themes/#####/gel/desktop/achievements.png
* themes/#####/gel/mobile/achievements.png

The asset pack to load these has also been updated:
https://github.com/bbc/childrens-games-genie-starter-pack/blob/master/themes/default/gel/gel-pack.json
