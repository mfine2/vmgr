'use strict';
var yargs = require('yargs');
var index = require('./index');
var argv = yargs.alias('d', 'delimiter').argv;

index(argv);