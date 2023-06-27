import { Marker as MapboxMarker } from "mapbox-gl"

const markerStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: 'red',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  cursor: 'pointer',
}

const marker = new MapboxMarker({
  anchor: 'bottom',
  offset: [0, -20],
})

const Marker = () => {
  return (
    <div >Marker</div>
  )
}

export default Marker