import { useEffect, useState } from 'react'
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
  const [lakes, setLakes] = useState([]);

  useEffect(() => {
    if (coords) {
      const url = new URL("http://localhost:8080/api/v1/lakes/markers");
      url.searchParams.append("lat", coords.lat.toString());
      url.searchParams.append("lng", coords.lng.toString());

      fetch(url.toString())
        .then((res) => res.json())
        .then((data) => {
          setLakes(data);
        });
    }
  }, [coords]);


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
