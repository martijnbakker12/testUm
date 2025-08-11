import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import store from './store';
import AppView from './views/AppView';
import LoginView from './views/LoginView';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/" element={<AppView />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
