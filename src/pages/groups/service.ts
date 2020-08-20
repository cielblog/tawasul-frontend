import request from '@/utils/request';
import { FormValueType } from '@/pages/groups/components/UpdateForm';

import { TableListParams } from './data.d';

export async function queryRule(params?: any) {
  return request('/v1/groups', {
    params,
  });
}

export async function removeGroup(params: string) {
  return request(`/v1/groups/${params}`, {
    method: 'DELETE',
  });
}

export async function addGroup(params: FormValueType) {
  return request('/v1/groups', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateGroup(id: number, params: TableListParams) {
  return request(`/v1/groups/${id}`, {
    method: 'POST',
    data: params,
  });
}

export async function getGroup(id: number) {
  return request(`/v1/groups/${id}`, { method: 'GET' });
}

export async function updateGroupStatus(ids: number[], status: number) {
  return request('/v1/groups/update-status', {
    method: 'POST',
    data: {
      status,
      ids,
    },
  });
}
