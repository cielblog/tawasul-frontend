import { Effect, Reducer } from 'umi';
import { sendMessage } from '@/pages/messages/compose/service';

export interface StateType {
  current?: string;
  step: {
    type: 'sms' | 'email' | 'pn' | null;
    destination: string | null;
    recipients: string[];
    message: string | null;
    subject?: string | null;
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
  };
}

const Model: ModelType = {
  namespace: 'composeMessage',

  state: {
    current: 'message-info',
    step: {
      type: null,
      destination: '',
      recipients: [],
      message: null,
      subject: null,
    },
  },

  effects: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    *submitStepForm({ payload }, { call, put }) {
      yield call(sendMessage, payload);
      yield put({
        type: 'saveForm',
        payload,
      });
      yield put({
        type: 'saveCurrentStep',
        payload: 'done',
      });
    },
  },

  reducers: {
    saveCurrentStep(state, { payload }) {
      return {
        ...state,
        current: payload,
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
  },
};

export default Model;
