import { Effect, Reducer } from 'umi';

import { DesktopData } from './data.d';
import { fetchGeneralStatistics } from './service';

export interface ModelType {
  namespace: string;
  state: DesktopData;
  effects: {
    fetchGeneralStatistics: Effect;
  };
  reducers: {
    saveGeneralStatistics: Reducer<DesktopData>;
    clear: Reducer<DesktopData>;
  };
}

const initState = {
  general: {
    countGroups: -1,
    countMessages: -1,
    countSmss: -1,
    countEmails: -1,
    countNotifications: -1,
  },
};

const Model: ModelType = {
  namespace: 'desktopModel',

  state: initState,

  effects: {
    *fetchGeneralStatistics(_, { call, put }) {
      const response = yield call(fetchGeneralStatistics);
      yield put({
        type: 'saveGeneralStatistics',
        payload: response,
      });
    },
  },

  reducers: {
    saveGeneralStatistics(state, { payload }) {
      return {
        ...state,
        general: {
          ...payload,
        },
      };
    },
    clear() {
      return initState;
    },
  },
};

export default Model;
