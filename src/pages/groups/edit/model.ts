import { Effect, Reducer, history } from 'umi';
import { getGroup, updateGroup } from '@/pages/groups/service';
import { message } from 'antd';

export interface GroupMember {
  name: string;
  email: string;
  mobile: string;
}

export interface CurrentGroup {
  title: string;
  description: string;
  status: string;
  members: GroupMember[];
}

export interface StateType {
  current?: CurrentGroup;
  server?: {
    code?: 400 | 500;
    errors?: [];
    message?: string;
  };
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    save: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrent: Reducer<StateType>;
    saveMembers: Reducer<StateType>;
    updateServer: Reducer<StateType>;
    resetServer: Reducer<StateType>;
    reset: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'groupEdit',

  state: {
    current: {
      title: '',
      description: '',
      status: '',
      members: [],
    },
    server: {
      errors: [],
      message: '',
    },
  },

  effects: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    *fetchCurrent({ payload }, { call, put }) {
      try {
        const response = yield call(getGroup, payload);

        yield put({
          type: 'saveCurrent',
          payload: response,
        });
      } catch (e) {
        if (e.response.status === 404) {
          message.error(e.data.message);
          history.push('/groups/my');
        }

        if (e.response.status === 400) {
          // ValidationError
        }
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    *save({ payload }, { call, put }) {
      put({ type: 'resetServer' });

      try {
        const response = yield call(updateGroup, payload!.id, payload);

        yield put({
          type: 'saveCurrent',
          payload,
        });

        yield put({
          type: 'updateServer',
          payload: {
            status: 'success',
            message: response.message,
            errors: [],
          },
        });

        message.success(response.message);
      } catch (e) {
        if (e.response.status === 400) {
          yield put({
            type: 'updateServer',
            payload: {
              code: 400,
              message: e.data.message,
              errors: e.data.data,
            },
          });
        }
      }
    },
  },

  reducers: {
    saveCurrent(state, { payload }) {
      return {
        ...state,
        current: payload,
      };
    },

    saveMembers(state, { payload }) {
      return {
        ...state,
        current: {
          ...state!.current,
          members: payload,
        },
      };
    },

    updateServer(state, { payload }) {
      return {
        ...state,
        server: payload,
      };
    },

    resetServer(state) {
      return {
        ...state,
        server: {
          message: '',
          errors: [],
        },
      };
    },

    reset(state) {
      return {
        ...state,
      };
    },
  },
};

export default Model;
