import {
  InfoWindow as GoogleInfoWindow,
  InfoWindowProps as GoogleInfoWindowProps,
} from "@react-google-maps/api";

interface InfoWindowProps extends GoogleInfoWindowProps {
  lake: any;
  fishList: any[];
}

const InfoWindow: React.FC<InfoWindowProps> = ({ lake, fishList }) => {
  return (
    <GoogleInfoWindow>
      <div className="capitalize">
        <h2 className="text-2xl font-semibold mb-2">{lake.name}</h2>
        <ul className="flex flex-col gap-2 px-2 ">
          {fishList.map((fish) => (
            <li key={fish.id}>{fish.name}</li>
          ))}
        </ul>
      </div>
    </GoogleInfoWindow>
  );
};

export default InfoWindow;
