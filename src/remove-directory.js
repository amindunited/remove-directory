/**
 * @license
 * Copyright Robin Buckley. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
'use strict';

const fs = require('fs');
const path = require('path');

const readDirectory = (directoryPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, results) => {
      if (err) { reject(err); }
      resolve(results);
    })
  });
}

const unlink = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) { reject(err); }
      resolve();
    })
  });
}

const removeDirectory = async (directoryPath) => {

  if (!directoryPath) {
    return Promise.reject(new Error('removeDirectory requires a Directory Path'));
  }

  let entries = await readDirectory(directoryPath);

  let results = await Promise.all(
    entries.map(entry => {
      let fullPath = path.join(directoryPath, entry);
      const stats = fs.statSync(fullPath);
      let task = stats.isDirectory() ? removeDirectory(fullPath) : unlink(fullPath);
      return task.catch(error => error);
  }));

  return await new Promise((resolve, reject) => {
    fs.rmdir(directoryPath, (err) => {
      if (err) { reject(err); }
      resolve();
    });
  });

};

module.exports = removeDirectory;
