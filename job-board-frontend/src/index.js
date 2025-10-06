import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

window.PRIMARY_COLOR = "#042341";
window.SECONDARY_COLOR = "#05284b";
window.COMPLEMENTARY_COLOR = "#F2F3F2";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


