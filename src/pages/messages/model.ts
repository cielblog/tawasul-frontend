import { Effect, Reducer } from 'umi';
import { MessageListItem } from '@/pages/messages/data';
import { fetchMessage, fetchMessages } from '@/pages/messages/service';

const defaultState: MessageModalState = {
  list: [],
  current: null,
};

export interface MessageModalState {
  list?: MessageListItem[];
  current?: MessageListItem | null;
  server?: {
    status?: 'idle' | 'success' | 'error';
    error?: any;
  };
}

export interface MessageModelType {
  namespace: string;
  state: MessageModalState;
  effects: {
    fetchList: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveList: Reducer<MessageModalState>;
    saveCurrent: Reducer<MessageModalState>;
    reset: Reducer<MessageModalState>;
    saveServerStatus: Reducer<MessageModalState>;
  };
}

const Model: MessageModelType = {
  namespace: 'messagesModel',

  state: {
    ...defaultState,
  },

  effects: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    *fetchList({ payload }, { call, put }) {
      try {
        const response = yield call(fetchMessages, payload);
        yield put({
          type: 'saveList',
          payload: response!.data,
        });

        // const promise =  yield select((state: { messagesList: MessagesListModelState }) => state.messagesList.list);
        return response;
      } catch (e) {
        yield put({
          type: 'saveServerStatus',
          payload: {
            status: 'error',
            error: e.data,
          },
        });

        return null;
      }
    },

    *fetchCurrent({ payload }, { call, put }) {
      try {
        const response = yield call(fetchMessage, payload);

        yield put({
          type: 'saveCurrent',
          payload: response,
        });
      } catch (e) {
        console.log('DONE');
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },

    saveCurrent(state, { payload }) {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reset(state, { payload }) {
      return {
        ...defaultState,
      };
    },
  },
};

export default Model;
