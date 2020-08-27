import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/v1/user');
}

export async function queryNotifications(): Promise<any> {
  return request('/v1/notifications');
}
