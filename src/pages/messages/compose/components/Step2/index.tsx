import React from 'react';
import { Button, Divider, Form } from 'antd';
import { connect, Dispatch, FormattedMessage } from 'umi';
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
  submitting?: boolean;
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
  const [form] = Form.useForm();
  const { data, dispatch, submitting, user } = props;
  const { type } = data;
  const { currentUser } = user;

  if (!data) {
    return null;
  }
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
        type: 'composeForm/submitStepForm',
        payload: {
          ...data,
          ...values,
        },
      });
    }
  };

  return (
    <Form form={form} layout="vertical" className={styles.stepForm}>
      <MessageField defaultValue={`${currentUser.username}: `} form={form} type={type!} />

      <Divider style={{ margin: '24px 0' }} />
      <Form.Item className={styles.stepActions}>
        <Button type="primary" onClick={onValidateForm} loading={submitting} className="pull-right">
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
  ({
    composeMessage,
    loading,
    user,
  }: {
    composeMessage: StateType;
    user: UserModelState;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    submitting: loading.effects['composeForm/submitStepForm'],
    data: composeMessage.step,
    user,
  }),
)(Step2);
