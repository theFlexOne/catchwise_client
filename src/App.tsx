import { useContext, useEffect, useState } from 'react'
import RootLayout from './layouts/RootLayout';
import useUserLocation from './hooks/useUserLocation';
import LandingPage from './pages/Dashboard';
import { MapProvider } from './contexts/MapContext/MapContext';
import Router from './Router';
import { NotificationsContext } from './contexts/NotificationContext/NotificationContext';



function App() {

  const notificationsCtx = useContext(NotificationsContext);

  notificationsCtx && console.log(notificationsCtx);

  return (
    <MapProvider>
      <Router />
    </MapProvider>
  )
}

export default App
