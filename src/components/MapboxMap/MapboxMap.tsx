import Map, { Marker, ViewStateChangeEvent, MapRef, Popup } from 'react-map-gl';
import { Lake } from '../../types/Lake';
import { filterByDistance } from '../../helpers/lakeFilters';
import { useContext, Fragment } from 'react';
import { MapboxMapProps } from './MapboxMap.types';
import axios from 'axios';
import haversine from '../../helpers/haversine';
import useMap from '../../contexts/MapContext/useMap';


const MapboxMap = ({ center }: MapboxMapProps) => {
  const { lakes, getLakes, mapRef, viewState } = useMap();

  lakes.length && console.log(lakes);

  const lakesToDisplay = filterByDistance({ lakes, coords: center, range: 20000 });

  return (
    <Map
      {...viewState}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN as string}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{
        width: "100%", height: "100%",
        transition: 'all 0.3s ease',
      }}
    // onMove={onMove}
    // onLoad={() => onLoad(center)}
    >
      {lakes.length && lakesToDisplay.map((lake: Lake) => (

        <Fragment key={lake.id}>
          <Marker
            style={{ cursor: 'pointer' }}
            // onClick={() => onMarkerClick(lake)}
            longitude={lake.coordinates.longitude}
            latitude={lake.coordinates.latitude}
          />
        </Fragment>
      ))}
    </Map>
  )
}

export default MapboxMap