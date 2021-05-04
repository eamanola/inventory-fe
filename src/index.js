import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
  );
};

render();
