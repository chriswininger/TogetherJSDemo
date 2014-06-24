var express = require('express');

var port = 3000,
    projectUrl = '/';

var app = new express();

//app.use(projectUrl, express.static(__dirname + '/public'));
app.use(projectUrl + 'css/', express.static(__dirname + '/public/css/'));
app.use(projectUrl, express.static(__dirname + '/public/html/'));
app.use(projectUrl + 'js/', express.static(__dirname + '/public/js/'));
app.use(projectUrl + 'images/', express.static(__dirname + '/public/images/'));

app.get(projectUrl, function (req, res) {
    res.redirect('/index.html');
});

app.listen(port);

console.log('server listening on port ' + port);
