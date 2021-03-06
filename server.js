var
  express = require('express'),
  app = express(),
  router = express.Router(),
  port = Number(process.env.PORT || 9999);

app.use('/assets', express.static(__dirname + '/assets'));
app.set('view engine', 'ejs');

app.use(router);

router.get('/', function(req, res) {
  res.render('index.ejs');
});



app.listen(port);
console.log('App listening on ' + port);