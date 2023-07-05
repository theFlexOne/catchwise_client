import { useEffect, useState } from 'react'
import RootLayout from './layouts/RootLayout';
import useUserLocation from './hooks/useUserLocation';
import LandingPage from './pages/LandingPage';
import { MapProvider } from './contexts/MapContext/MapContext';

type Link = {
  url: string;
  label: string;
};

const links: Link[] = [
  { url: "#1", label: "Home" },
  { url: "#2", label: "About" },
  { url: "#3", label: "Contact" },
];


function App() {
  const [coords, coordsError] = useUserLocation();

  return coords && (
    <MapProvider coords={coords}>
      <RootLayout links={links}>
        <LandingPage />
      </RootLayout>
    </MapProvider>
  )


}

export default App
