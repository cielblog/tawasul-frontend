import React from 'react';
import { Button, Divider, Form, Input } from 'antd';
import { connect, Dispatch, FormattedMessage, useIntl } from 'umi';
import SmsField from '@/pages/messages/compose/components/SmsField';
import EmailField from '@/pages/messages/compose/components/EmailField';
import { UserModelState } from '@/models/user';
import { FormInstance } from 'antd/lib/form';
// Types
import { StateType } from '../../model';
// Assets
import styles from './index.less';

interface Step2Props {
  data: StateType['step'];
  dispatch?: Dispatch;
  user: UserModelState;
}

interface MessageFieldProps {
  type: 'sms' | 'email' | 'pn';
  form: FormInstance;
  defaultValue?: string;
}

const MessageField: React.FC<MessageFieldProps> = (props) => {
  switch (props.type) {
    case 'sms':
      return <SmsField {...props} />;
    case 'email':
      return <EmailField {...props} />;
    case 'pn':
      return <SmsField {...props} />;
    default:
      return <>Cannot load this type</>;
  }
};

const Step2: React.FC<Step2Props> = (props) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const { data, dispatch, user } = props;

  const { currentUser } = user;

  if (!data) {
    return null;
  }

  const { type } = data;

  const { validateFields, getFieldsValue } = form;
  const onPrev = () => {
    if (dispatch) {
      const values = getFieldsValue();
      dispatch({
        type: 'composeMessage/saveForm',
        payload: {
          ...data,
          ...values,
        },
      });
      dispatch({
        type: 'composeMessage/saveCurrentStep',
        payload: 'message-info',
      });
    }
  };
  const onValidateForm = async () => {
    const values = await validateFields();

    if (dispatch) {
      dispatch({
        type: 'composeMessage/saveForm',
        payload: {
          ...data,
          ...values,
        },
      });

      if (props.data!.type === 'sms') {
        dispatch({
          type: 'composeMessage/saveCurrentStep',
          payload: 'report',
        });
      } else {
        dispatch({
          type: 'composeMessage/saveCurrentStep',
          payload: 'done',
        });
      }
    }
  };

  return (
    <Form form={form} layout="vertical" className={styles.stepForm}>
      {type === 'email' && (
        <Form.Item
          name="subject"
          label={formatMessage({ id: 'compose-form.step2.subject' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'compose-form.field-required' }),
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>
      )}

      <Form.Item
        name="message"
        label={formatMessage({ id: 'compose-form.step2.message' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'compose-form.field-required' }),
          },
        ]}
      >
        <MessageField defaultValue={`${currentUser.username}: `} form={form} type={type!} />
      </Form.Item>

      <Divider style={{ margin: '24px 0' }} />
      <Form.Item className={styles.stepActions}>
        <Button type="primary" onClick={onValidateForm} className="pull-right">
          <FormattedMessage id="component.next" />
        </Button>
        <Button onClick={onPrev} className="pull-left">
          <FormattedMessage id="component.prev" />
        </Button>
      </Form.Item>
    </Form>
  );
};
export default connect(
  ({ composeMessage, user }: { composeMessage: StateType; user: UserModelState }) => ({
    data: composeMessage.step,
    user,
  }),
)(Step2);
