import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Switch, Tooltip } from 'antd';
import { connect, Dispatch, FormattedMessage, useIntl } from 'umi';
import React, { FC, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MasterWrapper from '@/components/MasterWrapper';
import { StateType } from '@/pages/groups/edit/model';
import { getValidationErrors } from '@/utils/utils';
import MembersList from '@/pages/groups/edit/components/MembersList';
import styles from './style.less';

const FormItem = Form.Item;

interface GroupEditProps {
  submitting?: boolean;
  loading: boolean;
  dispatch: Dispatch;
  current: StateType['current'];
  server?: StateType['server'];
}

const GroupEdit: FC<GroupEditProps> = (props) => {
  const { formatMessage } = useIntl();
  const { submitting, loading, dispatch, current, server, match } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch
    if (dispatch) {
      dispatch({
        type: 'groupEdit/fetchCurrent',
        payload: match.params.id,
      });

      form.setFieldsValue({
        ...current,
      });
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      ...current,
    });
  }, [current]);

  useEffect(() => {
    if (server!.code === 400) {
      form.setFields(getValidationErrors(server?.errors));
    }
  });

  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'groupEdit/save',
      payload: {
        ...values,
        id: match.params.id,
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues: { [key: string]: any }) => {
    const { status } = changedValues;

    form.setFieldsValue({ status: status ? 'ACTIVE' : 'INACTIVE' });
  };

  return (
    <MasterWrapper>
      <PageHeaderWrapper content={<FormattedMessage id="group-edit.description" />}>
        <Card bordered={false} loading={submitting || loading}>
          <Form
            layout="vertical"
            form={form}
            name="group-edit"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={onValuesChange}
          >
            <FormItem
              label={<FormattedMessage id="group-edit.field.title" />}
              name="title"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'group-edit.field.title.required' }),
                },
              ]}
            >
              <Input placeholder={formatMessage({ id: 'group-edit.field.title' })} />
            </FormItem>
            <FormItem
              label={<FormattedMessage id="group-edit.field.description" />}
              name="description"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'group-edit.field.description.required' }),
                },
              ]}
            >
              <Input placeholder={formatMessage({ id: 'group-edit.field.description' })} />
            </FormItem>

            <FormItem
              label={<FormattedMessage id="group-edit.field.status" />}
              name="status"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'group-edit.field.status.required' }),
                },
              ]}
            >
              <Switch
                checkedChildren={formatMessage({ id: 'component.activated' })}
                unCheckedChildren={formatMessage({ id: 'component.disabled' })}
                checked={current!.status === 'ACTIVE'}
                disabled={current!.members.length === 0}
              />
            </FormItem>
            <Divider />
            <FormItem
              label={
                <span>
                  <FormattedMessage id="group-edit.field.members" />
                  <em className={styles.optional}>
                    <Tooltip title={<FormattedMessage id="group-edit.field.members" />}>
                      <InfoCircleOutlined style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
              name="members"
              rules={[
                {
                  validator: (rule, value, callback) => {
                    if (Array.isArray(value) && value.length === 0) {
                      callback(formatMessage({ id: 'group-edit.field.members.please-add-some' }));
                    } else {
                      callback();
                    }
                  },
                },
              ]}
            >
              <MembersList form={form} members={current!.members} dispatch={dispatch} />
            </FormItem>
            <FormItem style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="component.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    </MasterWrapper>
  );
};

export default connect(
  ({
    groupEdit,
    loading,
  }: {
    groupEdit: StateType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    submitting: loading.effects['groupEdit/save'],
    loading: loading.effects['groupEdit/fetchCurrent'],
    current: groupEdit.current,
    server: groupEdit.server,
  }),
)(GroupEdit);
