var express = require('express');
var app = express();

function createList(id) {
	var result = [];
	if (!id) {
		for (var i = 1; i < 10; i++) {
			obj = {
				id: i,
				name: '菜单' + i
			}
			result.push(obj);
		}
	} else {
		for (var i = 1; i < 10; i++) {
			obj = {
				id: `${id}.${i}`,
				name: `菜单${id}.${i}`
			}
			result.push(obj);
		}
	}
	return result;
}

app.use(express.static('public'));

app.get('/data', function (req, res) {
	var queryOpts = req.query,
		result;
	if (!queryOpts.id) {
		result = createList()
	} else {
		result = createList(queryOpts.id)
	}
	res.send(result)
});

app.get('/suggest', function (req, res) {
	var keyword = req.query.keyword,
		result = [];
	for (var i = 0; i < 20; i++) {
		result.push(`${keyword} ${Math.random().toString().substring(0,8)}`)
	}
	res.send(result)
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});