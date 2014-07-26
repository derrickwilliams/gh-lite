var
  express = require('express'),
  app = express(),
  router = express.Router();

app.use('/assets', express.static(__dirname + '/assets'));
app.set('view engine', 'ejs');

app.use(router);

router.get('/', function(req, res) {
  res.render('index.ejs');
});

app.listen(9999);
console.log('App listening on 9999');