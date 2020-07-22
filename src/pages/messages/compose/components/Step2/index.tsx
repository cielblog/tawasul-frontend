import React, { ReactNode } from 'react';
import { Button, Divider, Form } from 'antd';
import { connect, Dispatch, FormattedMessage } from 'umi';
import SmsField from '@/pages/messages/compose/components/SmsField';
import { StateType } from '../../model';
import styles from './index.less';

interface Step2Props {
  data: StateType['step'];
  dispatch?: Dispatch<any>;
  submitting?: boolean;
}

const getMessageField = (current: 'sms' | 'email' | 'pn' | null) => {
  switch (current) {
    case 'sms':
      return <SmsField />;
    case 'email':
      return <SmsField />;
    case 'pn':
      return <SmsField />;
    default:
      return '<div>Cannot load this type</div>';
  }
};

const Step2: React.FC<Step2Props> = (props) => {
  const [form] = Form.useForm();
  const { data, dispatch, submitting } = props;
  const { type } = data;
  const field: ReactNode = getMessageField(type);

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
    <Form form={form} layout="vertical" className={styles.stepForm} initialValues={data}>
      {field}
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
  }: {
    composeMessage: StateType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    submitting: loading.effects['composeForm/submitStepForm'],
    data: composeMessage.step,
  }),
)(Step2);
