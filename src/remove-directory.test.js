/**
 * @license
 * Copyright Robin Buckley. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
'use strict';
const path = require('path');
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const removeDirectory = require('./index');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Remove Directory ', () => {

  describe('basic set up', () => {

    it('should export a function', () => {
      expect(removeDirectory).to.be.a('function');
    });

    it('should throw an error if not given a directory', async () => {
      const err = removeDirectory();
      expect(err).to.eventually.be.rejectedWith(Error);
      return expect(err).to.eventually.be.rejected;
    });

  });

  describe('Deleting an empty directory', () => {
    before((done) => {
      fs.mkdir(path.join(__dirname, 'testing'), () => {
        done();
      });
    })
    it('should delete a single empty directory', async () => {
      const dirPath = path.join(__dirname, 'testing');
      const rmDir = removeDirectory(dirPath).catch(err => err);
      expect(rmDir).to.eventually.be.fulfilled;
      await rmDir;
      expect(fs.existsSync(dirPath)).to.be.false;
    });
  });

  describe('Deleting an directory with files', () => {
    before((done) => {
      fs.mkdirSync(path.join(__dirname, 'testing'));
      fs.writeFileSync(path.join(__dirname, 'testing', 'file_one.txt'));
      fs.writeFileSync(path.join(__dirname, 'testing', 'file_two.js'));
      fs.writeFileSync(path.join(__dirname, 'testing', 'file_three.css'));
      done();
    });

    it('should delete a directory with files', async () => {
      const dirPath = path.join(__dirname, 'testing');
      const rmDir = removeDirectory(dirPath).catch(err => err);
      expect(rmDir).to.eventually.be.fulfilled;
      await rmDir;
      expect(fs.existsSync(dirPath)).to.be.false;
    });
  });

  describe('Deleting nested directories', () => {
    before((done) => {
      fs.mkdirSync(path.join(__dirname, 'testing'));
      fs.mkdirSync(path.join(__dirname, 'testing/one'));
      fs.mkdirSync(path.join(__dirname, 'testing/two'));
      fs.mkdirSync(path.join(__dirname, 'testing/two/three'));
      fs.writeFileSync(path.join(__dirname, 'testing', 'file_one.txt'));
      fs.writeFileSync(path.join(__dirname, 'testing', 'file_two.js'));
      fs.writeFileSync(path.join(__dirname, 'testing', 'file_three.css'));
      fs.writeFileSync(path.join(__dirname, 'testing/two', 'file_two_two.css'));
      fs.writeFileSync(path.join(__dirname, 'testing/two/three', 'file_three_three.css'));
      done();
    });

    it('should delete nested directories', async () => {
      const dirPath = path.join(__dirname, 'testing');
      const rmDir = removeDirectory(dirPath).catch(err => err);
      expect(rmDir).to.eventually.be.fulfilled;
      await rmDir;
      expect(fs.existsSync(dirPath)).to.be.false;
    });
  });


  describe('Handling failures', () => {
    before((done) => {
      fs.mkdirSync(path.join(__dirname, 'testing'));
      fs.mkdirSync(path.join(__dirname, 'testing/one'));
      fs.mkdirSync(path.join(__dirname, 'testing/two'));
      fs.mkdirSync(path.join(__dirname, 'testing/two/three'));
      fs.writeFileSync(path.join(__dirname, 'testing', 'file_one.txt'));
      fs.writeFileSync(path.join(__dirname, 'testing', 'file_two.js'));
      fs.writeFileSync(path.join(__dirname, 'testing', 'file_three.css'));
      fs.writeFileSync(path.join(__dirname, 'testing/two', 'file_two_two.css'));
      fs.writeFileSync(path.join(__dirname, 'testing/two/three', 'file_three_three.css'));
      done();
    });

    after(async () => {
      const dirPath = path.join(__dirname, 'testing');
      const rmDir = removeDirectory(dirPath);
      return await rmDir;
    })

    it('should reject if directory does not exist', async () => {
      const dirPath = path.join(__dirname, '__testing');
      const rmDir = removeDirectory(dirPath);
      return expect(rmDir).to.eventually.be.rejectedWith(Error);
    });
  });

});
