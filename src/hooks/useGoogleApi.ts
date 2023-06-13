import axios from "axios";

const PLACES_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const PLACES_API_URL = "https://maps.googleapis.com/maps/api/place";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const googlePlacesServerEndpoint = `${SERVER_URL}/api/v1/google/place`;

export default function useGoogleApi() {
  async function searchForPlace(query: string, fields: string[] = []) {
    const url = new URL(googlePlacesServerEndpoint + "/search");
    fields = fields.length
      ? fields
      : ["name", "geometry", "place_id"];
    const params = { query, fields: fields.join(",") };
    url.search = new URLSearchParams(params).toString();

    try {
      const { data } = await axios.get(url.toString());
      return data;
    } catch (error) {
      console.warn(error);
    }
  }

  async function getPlaceDetails(
    placeId: string,
    fields: string[] = []
  ): Promise<any> {
    const url = new URL(googlePlacesServerEndpoint + "/details");
    const params = {
      place_id: placeId,
      fields: fields.length ? fields.join(",") : "",
    };
    url.search = new URLSearchParams(params).toString();

    try {
      const { data } = await axios.get(url.toString());
      console.log(data);
      return data;
    } catch (error) {
      console.warn(error);
    }
  }

  return {
    searchForPlace,
    getPlaceDetails,
  };
}
