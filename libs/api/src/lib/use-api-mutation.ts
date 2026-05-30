import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { AxiosRequestConfig, Method } from 'axios';
import { apiClient } from './axios-instance';

export type ApiMutationVariables<TBody = unknown> = {
  url: string;
  data?: TBody;
  config?: AxiosRequestConfig;
};

export type UseApiMutationOptions<
  TData = unknown,
  TBody = unknown,
  TContext = unknown,
> = Omit<
  UseMutationOptions<TData, Error, ApiMutationVariables<TBody>, TContext>,
  'mutationFn'
> & {
  method?: Method;
};

export function useApiMutation<
  TData = unknown,
  TBody = unknown,
  TContext = unknown,
>(
  options?: UseApiMutationOptions<TData, TBody, TContext>
): UseMutationResult<TData, Error, ApiMutationVariables<TBody>, TContext> {
  const { method = 'post', ...mutationOptions } = options ?? {};

  return useMutation({
    mutationFn: async ({ url, data, config }) => {
      const { data: responseData } = await apiClient.request<TData>({
        method,
        url,
        data,
        ...config,
      });
      return responseData;
    },
    ...mutationOptions,
  });
}
