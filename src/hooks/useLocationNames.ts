import { useState } from 'react';

type LocationName = {
  id: number;
  name: string;
  location: string;
}

const LOCATION_NAMES_URL = "http://localhost:8080/api/v1/location-names"

const useLocationNames = () => {
  const [locationNames, setLocationNames] = useState<LocationName[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLocationNames = async (query: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${LOCATION_NAMES_URL}?q=${query}`)
      const data = await response.json()
      setLocationNames(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { locationNames, isLoading, error, fetchLocationNames }
}

export default useLocationNames;