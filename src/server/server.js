import path from 'path';
import Express from 'express';
import XmlStatsApi from '../app/xmlstats/api';

var app = Express();
var server;

var api = new XmlStatsApi();

const PATH_STYLES = path.resolve(__dirname, '../client/styles');
const PATH_IMAGES = path.resolve(__dirname, '../client/images');
const PATH_DIST = path.resolve(__dirname, '../../dist');

app.use('/styles', Express.static(PATH_STYLES));
app.use('/images', Express.static(PATH_IMAGES));
app.use(Express.static(PATH_DIST));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.get('/results/:identifier', api.getResults.bind(api));

server = app.listen(process.env.PORT || 3000, () => {
  var port = server.address().port;

  console.log('Server is listening at %s', port);
});
