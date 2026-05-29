import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ACTIVE_LOCALE_META } from './content.jsx';
import './index.css';

document.documentElement.lang = ACTIVE_LOCALE_META?.htmlLang ?? 'en';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
