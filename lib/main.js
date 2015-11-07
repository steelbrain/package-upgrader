'use babel'

import Path from 'path'
import HTTPS from 'https'
import compare from './helpers'
import ChildProcess from 'child_process'
import {View} from './view'

function doUpgrade(name, metaData) {
  return new Promise(function(resolve, reject) {
    HTTPS.get(`https://atom.io/api/packages/${name}`, function(res) {
      const data = []
      res.on('data', function(chunk) {
        data.push(chunk)
      })
      res.on('end', function() {
        resolve(JSON.parse(data.join('')))
      })
    }).on('error', function(err) {
      reject(err)
    })
  }).then(function(contents) {
    const latestVersion = contents.releases.latest
    if (compare(latestVersion, metaData.metadata.version) === 1) {
      const view = new View(name)
      const process = ChildProcess.spawn(atom.packages.getApmPath(), ['install', `${name}@${latestVersion}`])

      view.show()
      process.on('close', function() {
        atom.packages.deactivatePackage(name)
        if (atom.packages.isPackageLoaded(name)) {
          atom.packages.unloadPackage(name)
        }
        atom.packages.activatePackage(name)
        view.finish()
      })
    }
  }, function(err) {
    console.error(`Error updating ${name}`, err)
  })
}

export function upgrade(name = null) {
  if (!name) {
    const chunks = __dirname.split(Path.sep)
    name = chunks[chunks.length - 3]
  }
  const metaData = atom.packages.getActivePackage(name)
  if (!metaData) {
    console.error(`Error updating ${name}`, 'Package is not activated')
    return {
      dispose: function() { /* No-Op */ }
    }
  }

  const interval = setInterval(function() {
    doUpgrade(name, metaData)
  }, 43200 * 1000)

  return {
    dispose: function() {
      clearInterval(interval)
    }
  }
}
