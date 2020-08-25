import React, { useState } from 'react';
import { useIntl } from 'umi';
import { Button, Form, Input, message, Modal } from 'antd';
import { FormValueType } from '@/pages/groups/components/UpdateForm';
import { addGroup } from '@/pages/groups/service';
import { getValidationErrors } from '@/utils/utils';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onVisible: (state: boolean) => void;
  columns: any;
  table: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, table } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleAdd = async (fields: FormValueType) => {
    const hide = message.loading(formatMessage({ id: 'groups-list.create.loading' }));
    setSubmitting(true);
    try {
      let response = null;
      response = await addGroup({ ...fields });
      table.reload();
      hide();
      onCancel();
      message.success(response.message);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { data } = error.data;
        hide();
        message.error(error.data.message);
        form.setFields(getValidationErrors(data));
      }
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    await handleAdd(fieldsValue);
  };
  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'groups-list.create.title' })}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={[
        <Button key="ok" type="primary" onClick={okHandle} loading={submitting}>
          {formatMessage({ id: 'component.save' })}
        </Button>,
      ]}
    >
      <Form form={form}>
        <Form.Item
          label={formatMessage({ id: 'groups-list.field.name' })}
          name="title"
          htmlFor="title"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'groups-list.create.name-required' }),
            },
          ]}
        >
          <Input
            disabled={submitting}
            placeholder={formatMessage({ id: 'groups-list.create.pleaseEnter' })}
            id="title"
          />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'groups-list.field.description' })}
          name="description"
          htmlFor="description"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'groups-list.create.description-required' }),
            },
          ]}
        >
          <Input
            placeholder={formatMessage({ id: 'groups-list.create.pleaseEnter' })}
            id="description"
            disabled={submitting}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
