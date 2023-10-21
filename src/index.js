#!/usr/bin/env node
const { Command } = require('commander');
const { createBoilerplate } = require('./helpers');
const { getPackageDescription, getPackageVersion } = require('./utils');
const templateConfig = require('../templates/config.json');

const program = new Command();

// If -V is used show the package version and exit
if (process.argv.includes('-V') || process.argv.includes('--version')) {
  console.log(getPackageVersion());
  process.exit(0);
}

program
  .addHelpText('beforeAll', `${getPackageDescription()}\n`)
  .arguments('<fileName>')
  .option('no option', 'create a contract boilerplate in the "src" folder')
  .option('-s, --script', 'create a script boilerplate in the "script" folder')
  .option('-t, --test', 'create a test boilerplate in the "test" folder')
  .option('-V, --version', 'show package version')
  .action(filename => createBoilerplate(filename, program.opts(), templateConfig))
  .parse(process.argv);
