import React, { useRef, useState } from 'react';
import { FormattedMessage, getLocale, useIntl } from 'umi';
import { RouteComponentProps } from 'react-router';

import { DownOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// @ts-ignore
import ProTable, { ActionType, ProColumns } from '@/components/LiveTable';
import { SorterResult } from 'antd/es/table/interface';
import MasterWrapper from '@/components/MasterWrapper';
import groupTableConfig from '@/pages/groups/config';

import CreateForm from './components/CreateForm';
import { TableListItem } from './data.d';
import { queryRule, removeGroup, updateGroupStatus } from './service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GroupsList: React.FC<RouteComponentProps> = (props) => {
  const { formatMessage } = useIntl();

  // Refs
  const actionRef = useRef<ActionType>();

  // States
  const [sorter, setSorter] = useState<string>('');
  const [assigned, setAssigned] = useState<boolean>(false);
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Handlers

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

  const handleFilter = (_: any, _filter: any, _sorter: any) => {
    const sorterResult = _sorter as SorterResult<TableListItem>;
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

    setSubmitting(true);

    try {
      const result = queryRule({
        size: params.pageSize,
        page: params.current,
        sort: newSorter,
        ...newParams,
      });

      await result;
      console.log(result);
      setSubmitting(false);
      return Promise.resolve(result);
    } catch (e) {
      return new Error('error');
    }
  };

  const columns: ProColumns<TableListItem>[] = groupTableConfig(formatMessage);

  return (
    <MasterWrapper>
      <PageHeaderWrapper content={<FormattedMessage id="group-list.description" />}>
        <ProTable<TableListItem>
          headerTitle={
            <Button
              type={assigned ? 'primary' : 'dashed'}
              icon={<UnorderedListOutlined />}
              loading={submitting}
              disabled={submitting}
              onClick={() => (assigned ? setAssigned(false) : setAssigned(true))}
            >
              <FormattedMessage id="group-list.button.only-assigned-group" />
            </Button>
          }
          actionRef={actionRef}
          rowKey="id"
          onChange={handleFilter}
          params={{ sorter, assigned }}
          locale={getLocale()}
          toolBarRender={(action, { selectedRows }) => [
            <Button
              type="primary"
              onClick={() => handleCreateModalVisible(true)}
              loading={submitting}
            >
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
                  <FormattedMessage id="groups-list.button.operation" />
                  <DownOutlined />
                </Button>
              </Dropdown>
            ),
          ]}
          tableAlertRender={false}
          request={request}
          pagination={{
            defaultPageSize: 15,
          }}
          columns={columns}
          rowSelection={{}}
        />
        <CreateForm
          onCancel={() => handleCreateModalVisible(false)}
          modalVisible={createModalVisible}
          columns={columns}
          onVisible={handleCreateModalVisible}
          table={actionRef.current}
        />
      </PageHeaderWrapper>
    </MasterWrapper>
  );
};

export default GroupsList;
