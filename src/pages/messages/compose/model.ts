import { Effect, Reducer } from 'umi';
import { sendMessage } from '@/pages/messages/compose/service';

export interface StateType {
  current?: string;
  step?: {
    type: 'sms' | 'email' | 'pn' | null;
    destination: string | null;
    recipients: string[];
    message: string | null;
    subject?: string | null;
  };
  server?: {
    status: 'idle' | 'success' | 'error';
    error: any;
  };
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitStepForm: Effect;
  };
  reducers: {
    saveForm: Reducer<StateType>;
    saveCurrentStep: Reducer<StateType>;
    reset: Reducer<StateType>;
    saveServerStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'composeMessage',

  state: {
    current: 'message-info',
    step: {
      type: null,
      destination: null,
      recipients: [],
      message: null,
      subject: null,
    },
    server: {
      status: 'idle',
      error: null,
    },
  },

  effects: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    *submitStepForm({ payload }, { call, put }) {
      try {
        const response = yield call(sendMessage, payload);

        yield put({
          type: 'saveServerStatus',
          payload: {
            status: 'success',
            error: response,
          },
        });
      } catch (e) {
        yield put({
          type: 'saveServerStatus',
          payload: {
            status: 'error',
            error: e.data,
          },
        });
      }
    },
  },

  reducers: {
    saveCurrentStep(state, { payload }) {
      return {
        ...state,
        current: payload,
      };
    },

    saveServerStatus(state, { payload }) {
      return {
        ...state,
        server: payload,
      };
    },

    saveForm(state, { payload }) {
      return {
        ...state,
        step: {
          ...(state as StateType).step,
          ...payload,
        },
      };
    },

    reset(state) {
      return {
        ...state,
        current: 'message-info',
        step: {
          type: null,
          destination: null,
          recipients: [],
          message: null,
          subject: null,
        },
      };
    },
  },
};

export default Model;
