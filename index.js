/* requires */

var util = require('util');
var Transform = require('stream').Transform;

/* constructor */

function CSV2SQL(options) {
  // allow use without new
  if (!(this instanceof CSV2SQL)) {
    return new CSV2SQL(options);
  }

  this.internalBuffer = '';

  this.isFirstDataRow = true;
  this.isFirstRowColumnNames = true;
  this.isFirstChunk = true;

  this.tableName = options.tableName || 'undefined';
  this.seperator = options.seperator || ',';
  this.lineSeperator = options.lineSeperator || '\n';
  this.dbName = options.dbName || false;


  //helper functions
  this.insertColumnNames = insertColumnNames;
  this.lineToInsert = lineToInsert;

  //init Transform, call super constructor
  Transform.call(this, options);
}
util.inherits(CSV2SQL, Transform);

/* implement transform stream */

//TODO: encoding not 'sticking'
CSV2SQL.prototype._transform = function(chunk, enc, cb) {
  this.internalBuffer += chunk.toString();
  var newLinePos;
  var line;
  var linePush;

  if (this.isFirstChunk && this.dbName !== false) {
    this.push('use ' + this.dbName + ';\n');
    this.isFirstChunk = false;
  }

  newLinePos = this.internalBuffer.indexOf(this.lineSeperator);

  while (newLinePos !== -1) {
    line = this.internalBuffer.substring(0, newLinePos);
    this.internalBuffer = this.internalBuffer.substring(newLinePos + 1);

    if (this.isFirstRowColumnNames) {
      linePush = this.insertColumnNames(line);
    } else {
      linePush = this.lineToInsert(line);
    }

    newLinePos = this.internalBuffer.indexOf(this.lineSeperator);

    this.push(linePush + '\n');
  }

  cb();
};

/* implement transform flush 'event' */

CSV2SQL.prototype._flush = function(cb) {
  this.push(';');
  cb();
};

/* helper */

function insertColumnNames(line) {
  var columnNamesArr = line.split(this.seperator);
  var columnNames = '(';
  for (var i = 0; i < columnNamesArr.length; i++) {
    columnNames += columnNamesArr[i] + ',';
  }
  //remove trailing comma
  columnNames = columnNames.substring(0, columnNames.length - 1);
  columnNames += ')';

  var insert = 'INSERT INTO ' + this.tableName + ' ' + columnNames + ' ' +
    'VALUES';

  this.isFirstRowColumnNames = false;

  return insert;
}

/* helper */

function lineToInsert(line) {
  var dataArr = line.split(this.seperator);
  var row;

  //insert comma's between VALUES (..), (..), ... , (..)
  if (this.isFirstDataRow) {
    row = '(';
    this.isFirstDataRow = false;
  } else {
    row = ',(';
  }

  //build up the row (a, b, ... , c)
  for (var i = 0; i < dataArr.length; i++) {
    if (dataArr[i] === '') {
      row += 'NULL';
    } else {
      //enclose datums in quotes
      row += '"' + dataArr[i] + '"';
    }

    //insert comma's between datums
    if (i !== dataArr.length - 1) {
      row += ',';
    }
  }
  row += ')';

  return row;
}

module.exports = CSV2SQL;
