csv2sql-lite
============

```
  _______ _______ ___ ___ _______ _______ _______ ___
 |   _   |   _   |   Y   |       |   _   |   _   |   |
 |.  1___|   1___|.  |   |___|   |   1___|.  |   |.  |
 |.  |___|____   |.  |   |/  ___/|____   |.  |   |.  |___
 |:  1   |:  1   |:  1   |:  1  \|:  1   |:  1   |:  1   |
 |::.. . |::.. . |\:.. ./|::.. . |::.. . |::..   |::.. . |
 `-------`-------' `---' `-------`-------`----|:.`-------' lite
                                              `--'
```

csv2sql-lite is a [transform stream](https://nodejs.org/api/stream.html#stream_class_stream_transform_1) which is both writable and readable. You would write a `.csv` file/string into it, and read out MySQL INSERT statements. Useful for large `.csv` files so one does not have to buffer the `.csv` into memory.

**Note:** See [csv2sql-stream](https://www.npmjs.com/package/csv2sql-stream) on npm for an alternative.

**Caveat:** The `.csv` parsing is very rudimentary, however it can be replaced easily by many  modules on [npm](https://www.npmjs.com), look for `lineToInsert()` in the source.

**Caveat:** Only tested on \*nix OS, YMMV on Windoze.

Usage
-----

Install:

```
npm install csv2sql-lite
```

Use:

```
var CSV2SQL = require('csv2sql-lite');
var csv2sql = CSV2SQL(opts);
```

See below for the documentation of `opts`, the [options](#options) object.

Example
-------

Open up a read stream to the `.csv` file and a write stream to where you want
the `.sql` file to be output:

```
var fs = require('fs');
var rstream = fs.createReadStream('./data.csv');
var wstream = fs.createWriteStream('./mysql.sql');
```

Load the `csv2sql-lite` module, with [options](#options):

```
var CSV2SQL = require('csv2sql-lite');
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
john,john@email.com,p455w0rd
suzie,suzie@email.com,ilovejohn
```


You'll end up with `mysql.sql` looking like this:

```
use myFancyDatabaseName;
INSERT INTO myTableName (username,email,password) VALUES
("john","john@email.com","p455w0rd")
,("suzie","suzie@email.com","ilovejohn")
;
```

Then you can easily load the `.sql` file into MySQL:

```
mysql -u root -p < mysql.sql
```

Options
-------

You can pass an options object to `csv2sql` containing any of the following:

Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
tableName     | `String`     | `'undefined'` | The name of the table to INSERT into
dbName        | `String`     | `false`       | Optionally insert `use dbName;` at beginning of `.sql` file
seperator     | `String`     | `','`         | Optionally specify cell seperator
lineSeperator | `String`     | `'\n'`        | Optionally specify EOL seperator

Testing
-------

Run `npm test` from the base directory to run tests.

License
-------

MIT
