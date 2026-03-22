declare module 'react-us-map' {
  import { FC } from 'react';

  interface USMapProps {
    fill?: (stateName: string) => string;
    stroke?: (stateName: string) => string;
    strokeWidth?: (stateName: string) => number;
    onClick?: (stateName: string) => void;
    onMouseEnter?: (stateName: string) => void;
    onMouseLeave?: (stateName: string) => void;
    title?: (stateName: string) => string;
  }

  export const USMap: FC<USMapProps>;
}
