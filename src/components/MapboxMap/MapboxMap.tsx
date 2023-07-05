import Map, { Marker } from 'react-map-gl';
import { Fragment } from 'react';
import useMap from '../../contexts/MapContext/useMap';
import LakeMarker from '../../types/LakeMarker';


const MapboxMap = () => {
  const { lakeMarkers, mapRef, onMove, onMarkerClick, viewState } = useMap();

  return (
    <Map
      {...viewState}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN as string}
      minZoom={11}
      maxZoom={15}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{
        width: "100%", height: "100%",
        transition: 'all 0.3s ease',
      }}
      onMove={onMove}
    // onLoad={() => onLoad(center)}
    >
      {lakeMarkers.map((marker: LakeMarker) => (
        <Fragment key={marker.lakeId}>
          <Marker
            style={{ cursor: 'pointer' }}
            onClick={() => onMarkerClick(marker)}
            longitude={marker.coordinates.lng}
            latitude={marker.coordinates.lat}
          />
        </Fragment>
      ))}
    </Map>
  )
}

export default MapboxMap