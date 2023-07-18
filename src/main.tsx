import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SettingsProvider from './contexts/SettingsContext.tsx'
import { NotificationsProvider } from './contexts/NotificationContext/NotificationContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </SettingsProvider>
  </React.StrictMode>,
)
