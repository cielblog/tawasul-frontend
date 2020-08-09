import { Effect, Reducer } from 'umi';

export interface StateType {
  current?: string;
  step: {
    type: 'sms' | 'email' | 'pn' | null;
    destination: string | null;
    recipients: string[];
    message: string | null;
    title?: string;
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
    current: 'message-content',
    step: {
      type: 'email',
      destination: 'recipients',
      recipients: ['0530433647'],
      message: null,
    },
  },

  effects: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    *submitStepForm({ payload }, { call, put }) {
      // yield call(fakeSubmitForm, payload);
      // yield put({
      //   type: 'saveForm',
      //   payload,
      // });
      // yield put({
      //   type: 'saveCurrentStep',
      //   payload: 'result',
      // });
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
