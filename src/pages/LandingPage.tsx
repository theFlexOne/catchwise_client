import Map from "../components/Map";



const LandingPage = ({ coords }: { coords: LatLngLiteral;}) => {
  return <div className="flex min-h-full">
    <div className="min-h-full min-w-10 bg-fuchsia-300 mr-auto">HELLO</div>
    <div className="relative min-h-max w-full max-w-[960px] mx-auto">

    <Map center={coords} />
    </div>
    </div>
};

export default LandingPage;

type LatLngLiteral = google.maps.LatLngLiteral;
