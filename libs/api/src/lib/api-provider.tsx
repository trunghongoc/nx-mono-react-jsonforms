import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { createQueryClient } from './query-client';

export interface ApiProviderProps {
  children: ReactNode;
  client?: QueryClient;
}

export function ApiProvider({ children, client }: ApiProviderProps) {
  const [queryClient] = useState(() => client ?? createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
