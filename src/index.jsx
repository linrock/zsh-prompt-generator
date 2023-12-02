import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';
import ZshPromptGenerator from './ZshPromptGenerator';

ReactDOM.hydrate(
  <React.StrictMode>
    <ZshPromptGenerator />
  </React.StrictMode>,
  document.getElementById('react-mount')
);
