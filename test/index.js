/* TEST RUNNER */

var tests = [
  fixtureTest,
  dropTableTest
];

var async = require('async');
var total = tests.length;
var passed = 0;
var failed = 0;

//run tests in parallel
async.each(tests, function(test, cb) {
  test(function(err, result) {
    if (err) {
      console.log('[FAILED] ' + test.name + ': ' + err);
      failed++;
    } else if (result) {
      console.log('[PASSED] ' + test.name + ': ' + result);
      passed++;
    } else {
      console.log('[PASSED] ' + test.name);
      passed++;
    }
    cb();
  });
}, function(err) {
  if (failed === 0) {
    console.log('\n[SUMMARY] PASSED ALL TESTS (Passed ' + passed + '/' + total + ' tests)');
    process.exit(0);
  } else {
    console.log('\n[SUMMARY] FAILING ' + failed + ' TESTS  (Passed ' + passed + '/' + total + ' tests)');
    process.exit(1);
  }
});

/* TEST */

function fixtureTest(cb) {
  var CSV2SQL = require('../index.js');
  var csv2sql = CSV2SQL({
    tableName: 'tableNameAmazing',
    dbName: 'dbNameSpectacular',
  });
  var fs = require('fs');
  var rstream;
  var sql = '';

  rstream = fs.createReadStream('./test/fixture.csv');

  rstream.on('error', function(e) {
    cb(e);
  });

  rstream.on('open', function() {
    rstream.pipe(csv2sql);

    csv2sql.on('data', function(chunk) {
      sql += chunk;
    });

    csv2sql.on('end', function() {
      var expectedSql =
        'USE dbNameSpectacular;\n' +
        'INSERT INTO tableNameAmazing (deviceId,date,latitude,longitude,altitude,accuracy,dataType,ctxFolder,capture) VALUES\n' +
        '("Elephant","2014/07/28 13:24:39","-25.821133","28.15825","1428","0","2","yoshi@email.org",NULL)\n' +
        ',("Elephant","2014/07/28 13:32:49","-25.821117","28.15825","1430","0","2","yoshi@email.org",NULL)\n' +
        ',("Elephant","2014/07/28 13:40:11","-25.821967","28.16035","1424","0",NULL,"yoshi@email.org",NULL)\n' +
        ';';
      if (sql === expectedSql) {
        cb(null, 'generated expected sql');
      } else {
        cb('did not produce expected sql');
      }
    });
  });
}

function dropTableTest(cb) {
  var CSV2SQL = require('../index.js');
  var csv2sql = CSV2SQL({
    tableName: 'tableNameAmazing',
    dbName: 'dbNameSpectacular',
    dropTable: true,
  });
  var fs = require('fs');
  var rstream;
  var sql = '';

  rstream = fs.createReadStream('./test/fixture.csv');

  rstream.on('error', function(e) {
    cb(e);
  });

  rstream.on('open', function() {
    rstream.pipe(csv2sql);

    csv2sql.on('data', function(chunk) {
      sql += chunk;
    });

    csv2sql.on('end', function() {
      var expectedSql =
        'USE dbNameSpectacular;\n' +
        'DROP TABLE IF EXISTS tableNameAmazing;\n' +
        'INSERT INTO tableNameAmazing (deviceId,date,latitude,longitude,altitude,accuracy,dataType,ctxFolder,capture) VALUES\n' +
        '("Elephant","2014/07/28 13:24:39","-25.821133","28.15825","1428","0","2","yoshi@email.org",NULL)\n' +
        ',("Elephant","2014/07/28 13:32:49","-25.821117","28.15825","1430","0","2","yoshi@email.org",NULL)\n' +
        ',("Elephant","2014/07/28 13:40:11","-25.821967","28.16035","1424","0",NULL,"yoshi@email.org",NULL)\n' +
        ';';
      if (sql === expectedSql) {
        cb(null, 'generated expected sql');
      } else {
        cb('did not produce expected sql');
      }
    });
  });
}
