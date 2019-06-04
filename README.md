# Google Calendar with React.js

This is a sample project for integrating the Google Calendar Api with 
a React.js web app. This project uses the Google Calendar 
[Browser Quickstart](https://developers.google.com/calendar/quickstart/js) as
a reference. 

![Screen Shot 2](./docs/screenshot-2.png)

## Integration

The important part of the integration is to render the react js app `after`
the google api js file is loaded. To achieve this we will need to wrap
`ReactDOM.render` in the `index.js` file with a window accessible function that can be called
on script load.

```jsx harmony
window.renderReactApp = () => {
    ReactDOM.render(<App
        clientId={keys.clientId}
        apiKey={keys.apiKey}/>, document.getElementById('root'));
};
``` 
 
Then at the bottom of the `public/index.html` file, we can add our modified
google api load script. 

```html
<script async defer src="https://apis.google.com/js/api.js"
        onload="this.onload=function(){};if(window.renderReactApp){window.renderReactApp();}"
        onreadystatechange="if (this.readyState === 'complete') this.onload()">
```

