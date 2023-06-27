import Map, { Marker, ViewStateChangeEvent, MapRef, Popup } from 'react-map-gl';
import { Lake } from '../../types/Lake';
import { filterByDistance } from '../../helpers/lakeFilters';
import { useContext, Fragment } from 'react';
import { MapboxMapProps } from './MapboxMap.types';
import axios from 'axios';
import haversine from '../../helpers/haversine';
import { MapContext, MapContextType } from '../../contexts/MapContext';


const MapboxMap = ({ center }: MapboxMapProps) => {

  const { viewState, setViewState, mapRef, onMarkerClick, onMove, onLoad, markers } = useContext(MapContext) as MapContextType;

  console.log("viewState", viewState);



  const markersToDisplay = filterByDistance({ lakes: markers, coords: { lat: viewState.latitude, lng: viewState.longitude }, range: 10 });



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
      onMove={onMove}
      onLoad={() => onLoad(center)}
    >
      {markers && markersToDisplay.map((lake: Lake) => (

        <Fragment key={lake.id}>
          <Marker
            style={{ cursor: 'pointer' }}
            onClick={() => onMarkerClick(lake)}
            longitude={lake.coordinates.longitude}
            latitude={lake.coordinates.latitude}
          />
        </Fragment>
      ))}
    </Map>
  )
}

export default MapboxMap