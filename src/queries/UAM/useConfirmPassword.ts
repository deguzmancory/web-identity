import { useMutation, UseMutationOptions } from 'react-query';
import apiClient from '../apiClient';
import { responseWrapper } from '../helpers';
import { ConfirmPasswordPayload } from './types';

export function useConfirmPassword(
  options?: UseMutationOptions<any, Error, ConfirmPasswordPayload>
) {
  const { mutate: confirmPassword, isLoading } = useMutation<any, Error, ConfirmPasswordPayload>({
    mutationFn: (payload: ConfirmPasswordPayload) =>
      responseWrapper(apiClient.confirmPassword, [payload]),
    ...options,
  });

  return {
    confirmPassword,
    isLoading,
  };
}
