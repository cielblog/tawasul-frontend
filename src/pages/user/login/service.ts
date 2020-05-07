import request from 'umi-request';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function userLogin(params: LoginParamsType) {
  return request('/v1/auth/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
