import path from 'path';
import fs from 'fs';
import Express from 'express';
import XmlStatsApi from '../app/xmlstats/api';
import mongoose from 'mongoose';

var app = Express();
var server;

function connect() {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect('mongodb://localhost/didtheywin', options);
}
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(path.join(__dirname, '../app/models')).forEach(function (file) {
    if (~file.indexOf('.js')) require(path.join(__dirname, '../app/models', file));
});

var api = new XmlStatsApi();

api.updateAllTeams();

const PATH_STYLES = path.resolve(__dirname, '../client/styles');
const PATH_IMAGES = path.resolve(__dirname, '../client/images');
const PATH_DIST = path.resolve(__dirname, '../../dist');

app.use('/styles', Express.static(PATH_STYLES));
app.use('/images', Express.static(PATH_IMAGES));
app.use(Express.static(PATH_DIST));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.get('/results/:identifier', api.serveResults.bind(api));

server = app.listen(process.env.PORT || 3000, () => {
  var port = server.address().port;

  console.log('Server is listening at %s', port);
});
