import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ScreenModeProvider } from "./context/ScreenModeContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <ScreenModeProvider>
        <App />
     </ScreenModeProvider>
  </React.StrictMode>
);

