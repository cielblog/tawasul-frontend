import React, { FC, useEffect } from 'react';
import { Card, message } from 'antd';
import { connect, Dispatch, FormattedMessage, useIntl } from 'umi';
import { RouteComponentProps } from 'react-router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MasterWrapper from '@/components/MasterWrapper';
import { MessagesListModelState } from '@/pages/messages/model';

interface Params {
  id: string;
}

interface MessageReadProps extends RouteComponentProps<Params> {
  loading: boolean;
  dispatch: Dispatch;
  current: MessagesListModelState['current'];
}

const MessageRead: FC<MessageReadProps> = (props) => {
  const { formatMessage } = useIntl();
  const { loading, dispatch, current, match, history } = props;
  const { id } = match.params;

  /**
   * IF ID not present, take the user back..
   */
  if (!id) {
    message.error(formatMessage({ id: 'group-edit.not-found' }));
    history.push('/groups/my');
  }

  useEffect(() => {
    // Fetch
    if (dispatch) {
      dispatch({
        type: 'messagesList/fetchCurrent',
        payload: id,
      });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSubject = () => {
    return current?.subject || formatMessage({ id: 'message-read.no-subject' });
  };

  return (
    <MasterWrapper>
      <PageHeaderWrapper content={<FormattedMessage id="message-read.description" />}>
        <Card bordered={false} loading={loading}>
          {current?.subject}
        </Card>
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
    loading: loading.effects['messagesList/fetchCurrent'],
    current: messagesList.current,
  }),
)(MessageRead);
