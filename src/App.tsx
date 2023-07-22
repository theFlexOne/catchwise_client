import MapProvider from './contexts/MapContext/MapContext';
import Router from './Router';
import AppModal from './components/AppModal';
import { useState } from 'react';



function App() {
  return (
    <MapProvider>
      <Router />
    </MapProvider>
  )
}

export default App
