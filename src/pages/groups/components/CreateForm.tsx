import React from 'react';
import { useIntl } from 'umi';
import { Form, Input, Modal } from 'antd';
import { FormValueType } from '@/pages/list/table-list/components/UpdateForm';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onVisible: (state: boolean) => void;
  onAdd: (fields: FormValueType) => void;
  columns: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onAdd } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    await onAdd(fieldsValue);
  };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'groups-list.create.title' })}
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={okHandle}
      okText={formatMessage({ id: 'component.save' })}
      cancelText={formatMessage({ id: 'component.cancel' })}
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
          <Input placeholder={formatMessage({ id: 'groups-list.create.pleaseEnter' })} id="title" />
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
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
