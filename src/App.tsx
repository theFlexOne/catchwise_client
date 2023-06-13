import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from "/vite.svg";
import RootLayout from './layouts/RootLayout';
import useUserLocation from './hooks/useUserLocation';
import LandingPage from './pages/LandingPage';

type Link = {
  url: string;
  label: string;
};

const links: Link[] = [
  { url: "#", label: "Home" },
  { url: "#", label: "About" },
  { url: "#", label: "Contact" },
];


function App() {
  const [coords, coordsError] = useUserLocation();

  return (
    <RootLayout links={links}>
      {coords ? (
        <LandingPage coords={coords} />
      ) : coordsError ? (
        <div>{coordsError.message}</div>
      ) : (
        <div>Loading...</div>
      )}
    </RootLayout>
  )

}

export default App
