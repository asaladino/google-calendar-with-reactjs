import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';
import {keys} from './keys';

window.renderReactApp = () => {
    ReactDOM.render(<App
        clientId={keys.clientId}
        apiKey={keys.apiKey}/>, document.getElementById('root'));
};

if(window.gapi) {
    window.renderReactApp();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
