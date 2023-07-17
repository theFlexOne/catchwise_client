import { useEffect, useState } from 'react'
import RootLayout from './layouts/RootLayout';
import useUserLocation from './hooks/useUserLocation';
import LandingPage from './pages/LandingPage';
import { MapProvider } from './contexts/MapContext/MapContext';
import Router from './Router';



function App() {
  return (
    <MapProvider>
      <Router />
    </MapProvider>
  )
}

export default App
