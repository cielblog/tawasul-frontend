import request from '@/utils/request';

export async function uploadEmailImage(data: FormData) {
  return request('/v1/filemanager/upload/email-image', {
    method: 'post',
    body: data,
    requestType: 'form',
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

export async function sendMessage(data: any) {
  return request(`/v1/compose`, {
    method: 'post',
    data,
  });
}
