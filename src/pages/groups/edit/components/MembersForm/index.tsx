import React, { FC } from 'react';
import { Dispatch, useIntl } from 'umi';
import { FormInstance } from 'antd/lib/form';
import { Button, Divider, Form, Input, message } from 'antd';
import { GroupMember } from '@/pages/groups/edit/model';
import RULES from '@/utils/regex';

const FormItem = Form.Item;

interface MembersFormProps {
  instance: FormInstance;
  dispatch: Dispatch;
  members: GroupMember[];
}

const MembersForm: FC<MembersFormProps> = (props) => {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const { instance, dispatch, members } = props;

  const requiredIfValidator = (
    rule: any,
    values: any[],
    callback: (arg0: string | undefined) => void,
  ) => {
    const { email, mobile } = form.getFieldsValue();

    if (!email && !mobile) {
      callback(formatMessage({ id: 'group-edit.field.members.choose-email-or-mobile' }));
    } else {
      callback();
    }
  };

  const handleSubmit = (values: { [key: string]: any }) => {
    const { name, email, mobile } = values;

    if (members && members.length > 0) {
      const isExists = members.find(
        (member) => (email && member.email === email) || (mobile && member.mobile === mobile),
      );
      if (isExists) {
        message.warn('يوجد عضو اخر بنفس المعلومات.');
        return false;
      }
    }

    const array: GroupMember[] = members;
    members.push({
      name,
      email,
      mobile,
    });
    instance.setFieldsValue({
      members: array,
    });

    if (dispatch) {
      dispatch({
        type: 'groupEdit/saveMembers',
        payload: array,
      });
    }
    form.resetFields();

    return true;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      validateMessages={{
        required: formatMessage(
          { id: 'group-edit.field.members.field.required' },
          // eslint-disable-next-line no-template-curly-in-string
          { field: '${label}' },
        ),
        pattern: {
          mismatch: formatMessage(
            { id: 'group-edit.field.members.field.wrong' },
            // eslint-disable-next-line no-template-curly-in-string
            { field: '${label}' },
          ),
        },
        types: {
          email: formatMessage(
            { id: 'group-edit.field.members.field.wrong' },
            // eslint-disable-next-line no-template-curly-in-string
            { field: '${label}' },
          ),
        },
      }}
    >
      <FormItem
        label={formatMessage({ id: 'group-edit.field.members.field.name' })}
        name="name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={formatMessage({ id: 'group-edit.field.members.field.email' })}
        name="email"
        rules={[
          {
            validator: requiredIfValidator,
          },
          {
            type: 'email',
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={formatMessage({ id: 'group-edit.field.members.field.mobile' })}
        name="mobile"
        rules={[
          {
            validator: requiredIfValidator,
          },
          {
            pattern: RULES.SAUDI_MOBILE,
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </FormItem>
      <Divider />
    </Form>
  );
};

export default MembersForm;
