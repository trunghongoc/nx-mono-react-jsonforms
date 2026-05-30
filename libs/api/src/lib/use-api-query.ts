import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';
import { apiClient } from './axios-instance';

export type UseApiQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, QueryKey>,
  'queryKey' | 'queryFn'
> & {
  config?: AxiosRequestConfig;
};

export function useApiQuery<TData = unknown>(
  queryKey: QueryKey,
  url: string,
  options?: UseApiQueryOptions<TData>
): UseQueryResult<TData, Error> {
  const { config, ...queryOptions } = options ?? {};

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<TData>(url, config);
      return data;
    },
    ...queryOptions,
  });
}
