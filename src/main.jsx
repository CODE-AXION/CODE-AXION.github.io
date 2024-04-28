import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';
import App from './App';
import { Provider } from 'react-redux';
import store from './stores/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <HashRouter>
      <ThemeProvider>
      <Provider store={store}>
        <App />
        </Provider>,
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
