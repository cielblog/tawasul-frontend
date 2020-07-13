import { Effect, Reducer } from 'umi';

import { queryCurrent, query as queryUsers } from '@/services/user';
import { setAuthority } from '@/utils/authority';

export interface CurrentUser {
  username: string | null;
  ar_name?: string | null;
  en_name?: string | null;
  id: number;
  roles: string[];
  avatar: string | null;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {
      username: '',
      ar_name: '',
      en_name: '',
      id: 0,
      roles: [],
      avatar: null,
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      setAuthority(action.payload.roles);
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
