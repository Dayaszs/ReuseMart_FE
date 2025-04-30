import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from "./routes";
import './index.css';
import Home from './Home/Home';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)