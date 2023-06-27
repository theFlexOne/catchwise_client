import { Lake } from '../../types/Lake';

export interface MapboxMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}
