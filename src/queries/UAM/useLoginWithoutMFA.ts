import { Auth } from 'aws-amplify';
import { useEffect } from 'react';
import { useMutation, UseMutationOptions } from 'react-query';
import appConfig from 'src/appConfig';
import apiClient from '../apiClient';
import { authResponseWrapper } from '../helpers';
import { SignInPayload } from './types';

export function useLoginWithoutMFA(options?: UseMutationOptions<any, Error, SignInPayload>) {
  const { mutate, isLoading } = useMutation<any, Error, SignInPayload>({
    mutationFn: (payload: SignInPayload) => authResponseWrapper(apiClient.signIn, [payload]),
    ...options,
  });

  useEffect(() => {
    Auth.configure(appConfig.CUSTOM_AWS_CONFIG);
    return () => {
      Auth.configure(appConfig.AWS_CONFIG);
    };
  }, []);

  return {
    login: mutate,
    isSigning: isLoading,
  };
}
