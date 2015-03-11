#csv2sql

##Introduction
csv2sql is a [transform stream](https://nodejs.org/api/stream.html#stream_class_stream_transform_1) which is both writable and readable. You would write a `.csv` file/string into it, and read out MySQL insert statements. Useful for large `.csv` files so one does not have to buffer the `.csv` into memory.

##Usage

Install:

```
npm install csv2sql
```

Use:

```
var CSV2SQL = require('csv2sql');
var csv2sql = CSV2SQL(opts);
```

See below for the documentation of `opts`, the [options](#Options) object.

##Example

Open up a readstream to the `.csv` file and a writestream to where you want
the `.sql` file to be output:

```
var fs = require('fs');
var rstream = fs.createReadStream('./data.csv');
var wstream = fs.createWriteStream('./mysql.sql');
```

Load the `csv2sql` module, with options:

```
var CSV2SQL = require('csv2sql');
var csv2sql = CSV2SQL({
  tableName: 'myTableName',
  dbName: 'myFancyDatabaseName',
});
```

Wire up the streams with `pipe()`:

```
rstream.pipe(csv2sql).pipe(wstream);
```

If you started with `data.csv` like this:

```
username,email,password
john,john@email.com,p455w04d
suzie,suzie@email.com,ilovejohn
```


You'll end up with `mysql.sql` looking like this:

```
use dbNameSpectacular;
INSERT INTO tableNameAmazing (username,email,password) VALUES
("john","john@email.com","p455w04d")
,("suzie","suzie@email.com","ilovejohn")
;
```

##Options
Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
tableName     | `String`     | `'undefined'` | The name of the table to INSERT into
dbName        | `String`     | `false`       | Optionally insert 'use dbName' at beginning of .sql
seperator     | `String`     | `','`         | Optionally specify cell seperator
lineSeperator | `String`     | `'\n'`        | Optionally specify end of line marker

##Testing

Run `npm test` from the base directory to run tests.
