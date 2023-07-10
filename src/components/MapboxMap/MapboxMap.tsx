import Map, { Marker } from 'react-map-gl';
import { Fragment } from 'react';
import useMap from '../../contexts/MapContext/useMap';
import LakeMarker from '../../types/LakeMarker';
import LakeSymbol from './MarkerSymbols/LakeSymbol';
import Dot from './MarkerSymbols/Dot';


const MapboxMap = () => {
  const { lakeMarkers, mapRef, onMove, onLoad, onMarkerClick, initialViewState } = useMap();




  return (
    <Map
      initialViewState={initialViewState}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN as string}
      minZoom={0}
      maxZoom={15}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{
        width: "100%", height: "100%",
        transition: 'all 0.3s ease',
      }}
      onMove={onMove}
      onLoad={onLoad}
    >
      {lakeMarkers.map((marker: LakeMarker) => (
        <Fragment key={marker.id}>
          <Marker
            data-lake-id={marker.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onMarkerClick(marker.id)}
            longitude={marker.coordinates[0]}
            latitude={marker.coordinates[1]}
          >
            <Dot /> :
          </Marker>
        </Fragment>
      ))}
    </Map>
  )
}

export default MapboxMap