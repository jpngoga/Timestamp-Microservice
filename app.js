var express = require('express');
var app = express();
var dateFormat = require('dateformat');

var handlebars = require('express-handlebars').create({ defaultLayout: null });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/*', function (req, res) {
  var queryObject = req.path;
  var queryString = queryObject.slice(1);
  var unixNum = 0;
  var trimedNaturalDate = '';
  var outPutJson = {};
  var trimedQueryString = queryString.replace(/%20/g, ' ');

  // Input case 1: unix format, milliseconds num
  var numCheckPattern = /^[0-9]*$/;
  if (numCheckPattern.test(queryString)) {
    unixNum = Number(queryString);
    var date = new Date(unixNum);
    trimedNaturalDate = dateFormat(date, 'longDate');
    outPutJson = {
      unix: unixNum,
      natural: trimedNaturalDate,
    };
  } else if (Date.parse(trimedQueryString)) {
    // Input case 2: natural format, special format should match.
    unixNum = Date.parse(trimedQueryString);
    outPutJson = {
      unix: unixNum,
      natural: trimedQueryString,
    };
  }

  res.json(outPutJson);
});

// custom 404 page
app.use(function (req, res, next) {
  res.status(404);
  res.render('404');
});

// custom 500 page
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  // console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-c to terminate.');
});
