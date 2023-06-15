import { createContext, useContext, useReducer, useState } from 'react';


export const SettingsContext = createContext<any>(null);

const initialState: Settings = {
  minZoom: 11,
  maxZoom: 17,
}

const reducer = (state: Settings, action: any) => {
  switch (action.type) {
    case 'SET_MIN_ZOOM':
      return { ...state, minZoom: action.payload };
    case 'SET_MAX_ZOOM':
      return { ...state, maxZoom: action.payload };
    default:
      return state;
  }
}


const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, dispatch] = useReducer(reducer, initialState);

  function updateZoom(type: string, n: number) {
    switch (type) {
      case 'min':
        dispatch({ type: 'SET_MIN_ZOOM', payload: n });
        break;
      case 'max':
        dispatch({ type: 'SET_MAX_ZOOM', payload: n });
        break;
      default:
        break;
    }
  }

  return (
    <SettingsContext.Provider value={{ ...settings, updateZoom }}>
      {children}
    </SettingsContext.Provider>
  );
}



type Settings = {
  minZoom: number;
  maxZoom: number;
}

interface SettingsContext extends Settings {
  incremenetMinZoom: (n: number) => void;
  incremenetMaxZoom: (n: number) => void;
}





export default SettingsProvider;