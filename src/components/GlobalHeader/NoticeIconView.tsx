import React, { Component } from 'react';
import { connect, injectIntl, ConnectProps, WrappedComponentProps } from 'umi';
import { message } from 'antd';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import { NoticeItem } from '@/models/global';
import { CurrentUser } from '@/models/user';
import { ConnectState } from '@/models/connect';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps>, WrappedComponentProps {
  notices?: NoticeItem[];
  currentUser?: CurrentUser;
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
}

class GlobalHeaderRight extends Component<GlobalHeaderRightProps> {
  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  changeReadState = (clickedItem: NoticeItem): void => {
    const { id } = clickedItem;
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: id,
      });
    }
  };

  handleNoticeClear = (title: string, key: string) => {
    const { dispatch } = this.props;
    message.success(`${'清空了'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };

  getNoticeData = (): {
    [key: string]: NoticeItem[];
  } => {
    const { notices = [] } = this.props;

    if (!notices || notices.length === 0 || !Array.isArray(notices)) {
      return {};
    }

    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };

      if (newNotice.created_at) {
        newNotice.created_at = moment(notice.created_at as string).fromNow();
      }

      return newNotice;
    });
    return groupBy(newNotices, 'channel');
  };

  getUnreadData = (noticeData: { [key: string]: NoticeItem[] }) => {
    const unreadMsg: {
      [key: string]: number;
    } = {};
    Object.keys(noticeData).forEach((key) => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter((item) => !item.read).length;
      }
    });
    return unreadMsg;
  };

  render() {
    const { intl } = this.props;
    const { formatMessage } = intl;
    const { fetchingNotices, onNoticeVisibleChange } = this.props;
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    return (
      <NoticeIcon
        className={styles.action}
        count={this.props.notices?.length}
        onItemClick={(item) => {
          this.changeReadState(item as NoticeItem);
        }}
        loading={fetchingNotices}
        clearText="清空"
        viewMoreText="查看更多"
        onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => message.info('Click on view more')}
        clearClose
      >
        <NoticeIcon.Tab
          tabKey="BALANCE"
          count={unreadMsg.BALANCE}
          list={noticeData.BALANCE}
          title={formatMessage({ id: 'components.notification.balance.title' })}
          emptyText={formatMessage({ id: 'component.notification.empty' })}
          showViewMore
        />
        <NoticeIcon.Tab
          tabKey="MESSAGES"
          count={unreadMsg.MESSAGES}
          list={noticeData.MESSAGES}
          title={formatMessage({ id: 'components.notification.messages.title' })}
          emptyText={formatMessage({ id: 'component.notification.empty' })}
          showViewMore
        />
        <NoticeIcon.Tab
          tabKey="SYSTEM"
          title={formatMessage({ id: 'components.notification.system.title' })}
          emptyText={formatMessage({ id: 'component.notification.empty' })}
          count={unreadMsg.SYSTEM}
          list={noticeData.SYSTEM}
          showViewMore
        />
      </NoticeIcon>
    );
  }
}

export default injectIntl(
  connect(({ user, global, loading }: ConnectState) => ({
    currentUser: user.currentUser,
    collapsed: global.collapsed,
    fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
    fetchingNotices: loading.effects['global/fetchNotices'],
    notices: global.notices,
  }))(GlobalHeaderRight),
);
