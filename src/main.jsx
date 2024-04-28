import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';
import App from './App';
import { Provider } from 'react-redux';
import store from './stores/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <Router basename="/CODE-AXION.github.io">
      <ThemeProvider>
      <Provider store={store}>
        <App />
        </Provider>,
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);