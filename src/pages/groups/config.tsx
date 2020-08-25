import { FormattedMessage, history } from 'umi';
import React from 'react';
// @ts-ignore
import { ProColumns } from '@/components/LiveTable';
import { TableListItem } from '@/pages/groups/data';
import { Button } from 'antd';

export default (formatMessage: (...args: any) => string): ProColumns<TableListItem>[] => {
  // @ts-ignore
  return [
    {
      title: 'اسم المجموعة',
      dataIndex: 'title',
      sorter: true,
    },
    {
      title: 'عدد الأعضاء',
      dataIndex: 'number_members',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: 'حالة المجموعة',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        ACTIVE: {
          text: formatMessage({ id: 'groups-list.field.status.activated' }),
          status: 'success',
        },
        INACTIVE: {
          text: formatMessage({ id: 'groups-list.field.status.disabled' }),
          status: 'error',
        },
      },
    },
    {
      title: 'تاريخ الإضافة',
      dataIndex: 'createdAt',
      fieldKey: 'createdAt',
      hideInForm: true,
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: 'تحكم',
      dataIndex: 'id',
      valueType: 'option',
      render: (_: any, record: { id: any }) => (
        <>
          <Button
            onClick={() => {
              history.push(`/groups/edit/${record.id}`);
            }}
            type="link"
            size="small"
          >
            <FormattedMessage id="component.edit" />
          </Button>
        </>
      ),
    },
  ];
};
