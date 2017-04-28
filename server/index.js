// import GitHub from 'github-api';
var express = require('express');
var bodyParser = require('body-parser')
var request = require('request');
var Repo = require('../database/index')
var app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/repos/import', function (req, res) {
  var username = req.body.term;
  request({
    url:`https://api.github.com/users/${username}/repos?access_token=972a03af4b453deadd9fef79821285e6c555f71c`,
    headers: {'User-Agent': 'ckeating-nh'},
    json: true
  }, function (error, response, body) {
    for (var i = 0; i < body.length; i++) {
      var repo = body[i];
      var username = repo.owner.login;
      var reponame = repo.name;
      var repoURL = repo.url
      var repoForkCount = repo.forks_count;
      console.log('RIGHT HERE')
      var obj = new Repo({
        'username': username,
        'reponame': reponame,
        'repoURL': repoURL,
        'repoForkCount': repoForkCount
      })
      obj.save(function(err,obj) {
        if (err) {return console.log('YOU IDIOT!', err)}
        else {console.log('YOU\'RE A STAR!')}
      })
    }
  })
  res.send('Chris responded')
});

app.get('/repos', function (req, res) {
  Repo.find(function(err, repos){
    if (err) {return console.log('err', err)}
    else {console.log('AYYBRUH')}
  })
  res.send('');
});

var port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

