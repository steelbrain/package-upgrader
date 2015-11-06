Atom-Package-Upgrader
=====================

Atom-Package-Upgrader is an npm module for you to use in your atom packages. It makes sure that the user always has the latest and greatest version of your package installed.
It will query the repos for any upgrades, if available, will install them for the user and show a nice notification along the way.

__Note:__ You should always have a config in your package that lets users disable auto-updates.

#### Example

```js
if (atom.config.get('my-package.autoUpdate')) {
  require('atom-package-upgrader').upgrade('my-package')
}
```

#### API

```js
function upgrade(name = null) {}
```

If no name is provided to upgrade, it tries to guess based on `__dirname`.

### LICENSE

This project is licensed under the terms of MIT license, See the license file or contact me for more info.
