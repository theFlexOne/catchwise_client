import MapProvider from './contexts/MapContext/MapContext';
import Router from './Router';



function App() {

  return (
    <MapProvider>
      <Router />
    </MapProvider>
  )
}

export default App
