import request from '@/utils/request';

export async function fetchMessages(params?: any) {
  return request('/v1/mailbox', {
    params,
  });
}

export async function fetchMessage(id: number) {
  return request(`/v1/mailbox/${id}`);
}
