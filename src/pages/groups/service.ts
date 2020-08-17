import request from '@/utils/request';
import { FormValueType } from '@/pages/groups/components/UpdateForm';

import { TableListParams } from './data.d';

export async function queryRule(params?: any) {
  return request('/v1/groups', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
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

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
