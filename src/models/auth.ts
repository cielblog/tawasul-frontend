import { Effect, Reducer, history } from 'umi';
import { login } from '@/services/auth';
import { getPageQuery, logout, saveAuthToken } from '@/utils/utils';
import { setToken } from '@/utils/request';
import { stringify } from 'querystring';

export interface AuthModelState {
  status?: 'ok' | 'error';
  error: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  token: string | null;
}

export interface AuthModelType {
  namespace: string;
  state: AuthModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<AuthModelState>;
    changeErrorStatus: Reducer<AuthModelState>;
    cleanAuthStates: Reducer<AuthModelState>;
  };
}

const AuthModel: AuthModelType = {
  namespace: 'auth',

  state: {
    status: undefined,
    token: sessionStorage.getItem('auth-token') ? sessionStorage.getItem('auth-token') : null,
    error: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(login, payload.data);

        yield put({
          type: 'changeLoginStatus',
          payload: {
            token: response.token,
            keepSession: payload.keepSession,
          },
        });

        // yield put({
        //   type: 'setToken',
        //   payload: response,
        // });
        // Login successfully
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        history.replace(redirect || '/');
      } catch (e) {
        if (e.response.status === 401) {
          yield put({
            type: 'changeErrorStatus',
            payload: e.data.message,
          });
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    *logout({ payload }, { put }) {
      yield put({
        type: 'cleanAuthStates',
      });

      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/auth/login' && !redirect) {
        history.replace({
          pathname: '/auth/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setToken(payload.token);
      saveAuthToken(payload.token);

      if (payload.keepSession) {
        saveAuthToken(payload.token);
      }

      return {
        ...state,
        status: 'ok',
        token: payload.token,
        error: '',
      };
    },
    changeErrorStatus(state, { payload }) {
      return {
        ...state,
        error: payload,
        status: 'error',
        token: null,
      };
    },
    cleanAuthStates(state) {
      logout();
      return {
        ...state,
        token: '',
        error: '',
      };
    },
  },
};

export default AuthModel;
