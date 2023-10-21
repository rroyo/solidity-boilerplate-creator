const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = require(packageJsonPath);

function getPackageDescription() {
  return packageJson.description;
}

function getPackageVersion() {
  return packageJson.version;
}

module.exports = {
  getPackageDescription,
  getPackageVersion,
};
