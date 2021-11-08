import React from 'react';
import { ClientSideOnly } from '../components/ClientSideOnly';
import { AmplitudeClientProvider } from '../components/AmplitudeClient';

export default function Root({ children }) {
  return (
    <ClientSideOnly>
      <AmplitudeClientProvider>
        {children}
      </AmplitudeClientProvider>
    </ClientSideOnly>
  );
};
