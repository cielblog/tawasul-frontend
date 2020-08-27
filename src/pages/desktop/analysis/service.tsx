import request from '@/utils/request';

export async function fetchGeneralStatistics() {
  return request('/v1/report/general');
}
