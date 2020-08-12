import request from '@/utils/request';

export interface ValidateSmsResult {
  price: number;
  current_balance: number;
  new_balance: number;
  recipients_count: number;
}
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

export async function validateSms(data: any) {
  return request('/v1/compose/validate-sms', {
    method: 'post',
    data,
  });
}
