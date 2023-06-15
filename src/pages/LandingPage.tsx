import Map from "../components/Map";


const LandingPage = ({ coords }: { coords: LatLngLiteral; }) => {
  return (
    <div className="flex min-h-full">
      <div className="w-1/4 min-w-[300px] bg-zinc-200/70"></div>
      <div className="relative min-h-max w-full mx-auto">

        <Map center={coords} />
      </div>
    </div>)
};

export default LandingPage;

type LatLngLiteral = google.maps.LatLngLiteral;
