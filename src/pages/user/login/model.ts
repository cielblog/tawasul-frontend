import {Effect, Reducer, history} from 'umi';
import {message} from 'antd';
import {getFakeCaptcha, userLogin} from './service';
import {getPageQuery, saveAuthToken} from './utils/utils';
import {setToken} from "@/utils/request";

export interface StateType {
  status?: 'ok' | 'error';
  error: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  token: string;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userLogin',

  state: {
    status: undefined,
  },

  effects: {
    * login({payload}, {call, put}) {
      try {
        const response = yield call(userLogin, payload.data);

        message.success('تم تسجيل الدخول بنجاح!');

        yield put({
          type: 'changeLoginStatus',
          payload: {
            token: response.token,
            keepSession: payload.keepSession
          },
        });

        // yield put({
        //   type: 'setToken',
        //   payload: response,
        // });
        // Login successfully
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {redirect} = params as { redirect: string };
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
            payload: e.data.description,
          });

        }
      }
    },

    * getCaptcha({payload}, {call}) {
      yield call(getFakeCaptcha, payload);
    },
  },

  reducers: {
    changeLoginStatus(state, {payload}) {
      setToken(payload.token);

      if (payload.keepSession) {
        saveAuthToken(payload.token)
      }

      return {
        ...state,
        status: 'ok',
        token: payload.token,
      };
    },
    changeErrorStatus(state, {payload}) {
      return {
        ...state,
        error: payload,
        status: 'error'
      }
    },
  },
};

export default Model;
