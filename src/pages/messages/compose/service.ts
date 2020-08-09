import request from '@/utils/request';

export async function uploadEmailImage(data: FormData) {
  return request('/v1/filemanager/upload/email-image', {
    method: 'post',
    data,
  });
}

export async function viewEmail(data: any) {
  return request('/v1/email/view', {
    method: 'post',
    headers: {
      Accept: 'text/html',
    },
    data,
  });
}
