import React, { useRef, useState } from 'react';
import { connect, Dispatch, FormattedMessage, getLocale, history, useIntl } from 'umi';
import { RouteComponentProps } from 'react-router';
import { MessagesListModelState } from '@/pages/messages/model';

import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// @ts-ignore
import ProTable, { ActionType, ProColumns } from '@/components/LiveTable';
import { SorterResult } from 'antd/es/table/interface';
import MasterWrapper from '@/components/MasterWrapper';
import messagesTableConfig from './config';

import { MessageListItem } from './data.d';

interface MessagesListProps extends RouteComponentProps {
  list?: MessageListItem[];
  current?: MessageListItem;
  dispatch?: Dispatch;
  loading: boolean;
}

const MessagesList: React.FC<MessagesListProps> = (props) => {
  const { formatMessage } = useIntl();

  // Props
  const { dispatch, loading } = props;

  // Refs
  const actionRef = useRef<ActionType>();

  // States
  const [sorter, setSorter] = useState<string>('');

  const handleFilter = (_: any, _filter: any, _sorter: any) => {
    const sorterResult = _sorter as SorterResult<MessageListItem>;
    if (sorterResult.field) {
      setSorter(`${sorterResult.field}_${sorterResult.order}`);
    }
  };

  const request = async (params: any, sort: any) => {
    const newParams = { ...params };
    const newSorter: string = Object.keys(sort)
      .map((key) => {
        let value: string = sort[key];

        if (value === 'descend') value = 'desc';
        if (value === 'ascend') value = 'asc';

        return `${key},${value}`;
      })
      .join();

    if (dispatch) {
      const response: any = dispatch({
        type: 'messagesList/fetchList',
        payload: {
          size: params.pageSize,
          page: params.current,
          sort: newSorter,
          ...newParams,
        },
      });

      return response;
    }
    return Error('DISPATCH NOT FOUND');
  };

  const columns: ProColumns<MessageListItem>[] = messagesTableConfig(formatMessage);

  return (
    <MasterWrapper>
      <PageHeaderWrapper content={<FormattedMessage id="messages-list.description" />}>
        <ProTable<MessageListItem>
          headerTitle={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              loading={loading}
              onClick={() => history.push('/messages/compose')}
            >
              &nbsp;
              <FormattedMessage id="messages-list.button.compose" />
              &nbsp;
            </Button>
          }
          actionRef={actionRef}
          rowKey="id"
          onChange={handleFilter}
          params={{ sorter }}
          locale={getLocale()}
          tableAlertRender={false}
          request={request}
          pagination={{
            defaultPageSize: 10,
          }}
          columns={columns}
          rowSelection={{}}
        />
      </PageHeaderWrapper>
    </MasterWrapper>
  );
};

export default connect(
  ({
    messagesList,
    loading,
  }: {
    messagesList: MessagesListModelState;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    loading: loading.effects['messagesList/fetchList'],
    current: messagesList.current,
    server: messagesList.server,
    list: messagesList.list,
  }),
)(MessagesList);
