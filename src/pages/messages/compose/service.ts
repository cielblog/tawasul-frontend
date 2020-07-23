import request from '@/utils/request';

export async function uploadEmailImage(data: FormData) {
  return request('/v1/filemanager/upload', {
    headers: {
      'Content-Type': `multipart/form-data`,
    },
    method: 'POST',
    data,
  });
}
