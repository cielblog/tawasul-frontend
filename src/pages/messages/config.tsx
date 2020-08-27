import { FormattedMessage, history } from 'umi';
import React from 'react';
import { Button } from 'antd';

export default (formatMessage: (...args: any) => string): any => {
  // @ts-ignore
  return [
    {
      title: formatMessage({ id: 'messages-list.field.id' }),
      dataIndex: 'id',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'messages-list.field.subject' }),
      dataIndex: 'subject',
      sorter: false,
      render: (_: any, record: { subject: any }) =>
        !record.subject
          ? formatMessage({ id: 'messages-list.field.subject.no-subject' })
          : record.subject,
    },
    {
      title: formatMessage({ id: 'messages-list.field.type' }),
      dataIndex: 'type',
      sorter: false,
      valueEnum: {
        push_notification: {
          text: formatMessage({ id: 'messages-list.field.type.pn' }),
        },
        sms: {
          text: formatMessage({ id: 'messages-list.field.type.sms' }),
        },
        email: {
          text: formatMessage({ id: 'messages-list.field.type.email' }),
        },
      },
    },
    {
      title: formatMessage({ id: 'messages-list.field.number_recipients' }),
      dataIndex: 'numberRecipients',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'messages-list.field.state' }),
      dataIndex: 'state',
      hideInForm: true,
      valueEnum: {
        succeed: {
          text: formatMessage({ id: 'messages-list.field.state.succeed' }),
          status: 'success',
        },
        accepted: {
          text: formatMessage({ id: 'messages-list.field.state.accepted' }),
          status: 'processing',
        },
        need_approving: {
          text: formatMessage({ id: 'messages-list.field.state.need_approving' }),
          status: 'default',
        },
        rejected: {
          text: formatMessage({ id: 'messages-list.field.state.rejected' }),
          status: 'warning',
        },
        failed: {
          text: formatMessage({ id: 'messages-list.field.state.failed' }),
          status: 'error',
        },
      },
    },
    {
      title: formatMessage({ id: 'messages-list.field.sent_at' }),
      dataIndex: 'sentAt',
      hideInSearch: true,
      hideInForm: true,
      sorter: false,
      valueType: 'datetime',
    },
    {
      title: formatMessage({ id: 'components.controls' }),
      dataIndex: 'id',
      valueType: 'option',
      render: (_: any, record: { id: any }) => (
        <>
          <Button
            onClick={() => {
              history.push(`/messages/read/${record.id}`);
            }}
            size="small"
            type="dashed"
          >
            <FormattedMessage id="messages-list.button.read" />
          </Button>
        </>
      ),
    },
  ];
};
