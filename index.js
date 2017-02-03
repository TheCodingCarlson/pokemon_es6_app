var express = require('express');
var app = express();
var hbs = require('express-hbs');
var path = require('path');

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs.express3({
	partialsDir: __dirname + '/views/partials',
	defaultLayout: __dirname + '/views/layout.hbs'
}));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/team', function(req, res) {
	res.render('team');
});

app.get('/search', function(req,res) {
	res.render('search');
});

app.listen(3000);