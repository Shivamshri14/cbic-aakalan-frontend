import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './scss/vendors/_custom.scss'
import './scss/vendors/_theme.scss'
import './scss/vendors/_variables.scss'
import './scss/vendors/ads.scss'
import './scss/vendors/simplebar.scss'
import './scss/vendors/examples.scss'
import './scss/vendors/style.scss'
import './Assets/js/main.js'
import './scss/styletheme.scss'
import './scss/vendors/media.scss'
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <BrowserRouter>
     <App />
     </BrowserRouter>
   
  </React.StrictMode>
);


reportWebVitals();
