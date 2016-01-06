var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/comments', function(req, res){
	var options = {
		url: 'https://comment.detik.com/v2/?get&key=3111495&group=72&limit=10&sort=newest&date=06-01-2016&start=1&limit=2'
	}

	function callback(error, response, body) {
		if (! error && response.statusCode == 200) {
			var comment = JSON.parse(body);
			
			res.setHeader('Cache-Control', 'no-cache');
    		res.json(comment);
		}
	}

	request(options, callback);
});


app.listen(app.get('port'), function(){
	console.log('Server started: http://localhost:'+app.get('port')+'/');
});