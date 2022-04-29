import React from 'react';
import { AmplitudeClientProvider } from '../components/AmplitudeClient';

export default function Root({ children }) {
  return (
    <AmplitudeClientProvider>
      {children}
    </AmplitudeClientProvider>
  );
};
