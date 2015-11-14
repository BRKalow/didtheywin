import Debug from 'debug';
import App from '../../app';

var attachElement = document.getElementById('app');

var state = {
};

var app;

Debug.enable('myApp*');

// Create new app and attach to element
app = new App();

app.renderToDOM(attachElement);
