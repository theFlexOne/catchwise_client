import Map, { Marker } from 'react-map-gl';
import { Fragment } from 'react';
import useMap from '../../contexts/MapContext/useMap';
import LakeMarker from '../../types/LakeMarker';
import LakeSymbol from './MarkerSymbols/LakeSymbol';
import Dot from './MarkerSymbols/Dot';


const MapboxMap = () => {
  const { lakeMarkers, mapRef, onMove, onMarkerClick, viewState, zoom } = useMap();

  return (
    <Map
      {...viewState}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN as string}
      minZoom={zoom.MIN}
      maxZoom={zoom.MAX}
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
          >
            {zoom.current < 11 ?
              <Dot /> :
              <LakeSymbol />
            }
          </Marker>
        </Fragment>
      ))}
    </Map>
  )
}

export default MapboxMap