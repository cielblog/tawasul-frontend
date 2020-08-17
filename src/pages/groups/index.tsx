import React, { useRef, useState } from 'react';
import { FormattedMessage, getLocale, useIntl } from 'umi';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@/components/LiveTable';
import { SorterResult } from 'antd/es/table/interface';
import MasterWrapper from '@/components/MasterWrapper';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { addGroup, queryRule, removeRule, updateRule } from './service';

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('اعدادات');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('تم تحديث الاعدادت بنجاح');
    return true;
  } catch (error) {
    hide();
    message.error('فشل التحديث، يرجى المحالة مرة أخرى!');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();

  const handleAdd = async (fields: FormValueType) => {
    const hide = message.loading('正在添加');
    try {
      await addGroup({ ...fields });
      hide();
      message.success(formatMessage({ id: 'groups-list.create.done' }));
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
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
      dataIndex: 'activated',
      hideInForm: true,
      valueEnum: {
        true: {
          text: formatMessage({ id: 'groups-list.field.status.activated' }),
          status: 'success',
        },
        false: {
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
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            <Button type="link" size="small">
              <FormattedMessage id="component.edit" />
            </Button>
          </a>
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
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> <FormattedMessage id="group-list.create-button" />
            </Button>,
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'remove') {
                        await handleRemove(selectedRows);
                        action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="remove">批量删除</Menu.Item>
                    <Menu.Item key="approval">批量审批</Menu.Item>
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
            const newSorter: string = Object.keys(sort).map((key) => {
              let value: string = sort[key];

              if (value === 'descend') value = 'desc';
              if (value === 'ascend') value = 'asc';

              return `${key},${value}`;
            });
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
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
          columns={columns}
          onAdd={handleAdd}
          onVisible={handleModalVisible}
        />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            onSubmit={async (value) => {
              const success = await handleUpdate(value);
              if (success) {
                handleUpdateModalVisible(false);
                setStepFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setStepFormValues({});
            }}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    </MasterWrapper>
  );
};

export default TableList;
