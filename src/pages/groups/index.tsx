import React, { useRef, useState } from 'react';
import { FormattedMessage, getLocale, history, useIntl } from 'umi';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@/components/LiveTable';
import { SorterResult } from 'antd/es/table/interface';
import MasterWrapper from '@/components/MasterWrapper';

import CreateForm from './components/CreateForm';
import { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { addGroup, queryRule, removeGroup, updateGroupStatus } from './service';

const TableList: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const handleAdd = async (fields: FormValueType) => {
    const hide = message.loading(formatMessage({ id: 'groups-list.create.loading' }));
    try {
      await addGroup({ ...fields });
      actionRef.current.reload();
      hide();
      handleCreateModalVisible(false);
      message.success(formatMessage({ id: 'groups-list.create.done' }));
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };

  const handleRemove = async (selectedRows: TableListItem[]) => {
    const hide = message.loading(formatMessage({ id: 'groups-list.delete.loading' }));
    setSubmitting(true);
    if (!selectedRows) return true;
    try {
      const ids: string = selectedRows.map((x) => x.id).join(',');
      const response = await removeGroup(ids);
      setSubmitting(false);
      hide();
      message.success(response.message);
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const handleStatusChange = async (status: number, selectedRows: TableListItem[]) => {
    const hide = message.loading(formatMessage({ id: 'groups-list.delete.loading' }));
    setSubmitting(true);
    if (!selectedRows) return true;
    try {
      const ids: number[] = selectedRows.map((x) => x.id);

      const response = await updateGroupStatus(ids, status);
      setSubmitting(false);
      hide();
      message.success(response.message);
      actionRef.current.clearSelected();
      return true;
    } catch (error) {
      hide();
      if (error.response.status === 400) {
        message.warn(error.data.message);
      }
      return false;
    }
  };

  const columns: ProColumns<TableListItem>[] = [
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
      render: (_, record) => (
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

  return (
    <MasterWrapper>
      <PageHeaderWrapper>
        <ProTable<TableListItem>
          headerTitle="قائمة مجموعاتي"
          actionRef={actionRef}
          rowKey="id"
          onChange={(_, _filter, _sorter) => {
            const sorterResult = _sorter as SorterResult<TableListItem>;
            if (sorterResult.field) {
              setSorter(`${sorterResult.field}_${sorterResult.order}`);
            }
          }}
          params={{
            sorter,
          }}
          locale={getLocale()}
          toolBarRender={(action, { selectedRows }) => [
            <Button type="primary" onClick={() => handleCreateModalVisible(true)}>
              <PlusOutlined /> <FormattedMessage id="group-list.create-button" />
            </Button>,
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'remove') {
                        await handleRemove(selectedRows);
                        await action.reload();
                      }

                      if (e.key === 'active') {
                        await handleStatusChange(0, selectedRows);
                        await action.reload();
                      }
                      if (e.key === 'inactive') {
                        await handleStatusChange(1, selectedRows);
                        await action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="remove" disabled={submitting}>
                      <FormattedMessage id="groups-list.button.delete" />
                    </Menu.Item>
                    <Menu.Item key="active" disabled={submitting}>
                      <FormattedMessage id="groups-list.button.active" />
                    </Menu.Item>
                    <Menu.Item key="inactive" disabled={submitting}>
                      <FormattedMessage id="groups-list.button.inactive" />
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  <FormattedMessage id="groups-list.button.operation" /> <DownOutlined />
                </Button>
              </Dropdown>
            ),
          ]}
          tableAlertRender={false}
          request={(params, sort) => {
            const newParams = { ...params };
            const newSorter: string = Object.keys(sort)
              .map((key) => {
                let value: string = sort[key];

                if (value === 'descend') value = 'desc';
                if (value === 'ascend') value = 'asc';

                return `${key},${value}`;
              })
              .join();
            return queryRule({
              size: params.pageSize,
              page: params.current,
              sort: newSorter,
              ...newParams,
            });
          }}
          pagination={{
            defaultPageSize: 10,
          }}
          columns={columns}
          rowSelection={{}}
        />
        <CreateForm
          onCancel={() => handleCreateModalVisible(false)}
          modalVisible={createModalVisible}
          columns={columns}
          onAdd={handleAdd}
          onVisible={handleCreateModalVisible}
        />
      </PageHeaderWrapper>
    </MasterWrapper>
  );
};

export default TableList;
