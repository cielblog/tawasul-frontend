import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Result, Skeleton, Descriptions, Popconfirm } from 'antd';
import { connect, Dispatch, FormattedMessage, useIntl, Link } from 'umi';
import { validateSms, ValidateSmsResult } from '@/pages/messages/compose/service';

import { UserModelState } from '@/models/user';
// Types
import { StateType } from '../../model';
// Assets
import styles from './index.less';

interface Step3PRops {
  data: StateType['step'];
  dispatch?: Dispatch;
  submitting?: boolean;
  user: UserModelState;
}

const Step3: React.FC<Step3PRops> = (props) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const { data, dispatch, submitting } = props;
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [result, setResult] = useState<ValidateSmsResult>({
    price: 0,
    current_balance: 0,
    new_balance: 0,
    recipients_count: 0,
    can_send: false,
  });

  const doValidate = () => {
    setLoadingDetails(true);
    validateSms(data)
      .then((response) => {
        setResult(response);
        setLoadingDetails(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      })
      .catch((exception) => {
        console.log(exception);
      });
  };

  useEffect(() => {
    doValidate();
  }, []);
  if (!data) {
    return null;
  }

  console.log(result);
  const { getFieldsValue } = form;

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
    if (dispatch) {
      dispatch({
        type: 'composeMessage/saveCurrentStep',
        payload: 'done',
      });
    }
  };

  return (
    <div className={styles.stepForm}>
      {loadingDetails ? (
        <Skeleton active />
      ) : (
        <Result
          status={result.can_send ? 'success' : 'warning'}
          title={formatMessage({ id: 'compose-form.step3.result-title' })}
          subTitle={
            result.can_send
              ? formatMessage({ id: 'compose-form.step3.result-success' })
              : formatMessage({ id: 'compose-form.step3.result-warning' })
          }
          extra={[
            <div className={styles.information}>
              <Descriptions column={1}>
                <Descriptions.Item label={formatMessage({ id: 'compose-form.step3.price' })}>
                  {result.price}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: 'compose-form.step3.myBalance' })}>
                  {result.current_balance}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: 'compose-form.step3.newBalance' })}>
                  {result.new_balance}
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({ id: 'compose-form.step3.numberRecipients' })}
                >
                  {result.recipients_count}
                </Descriptions.Item>
              </Descriptions>
            </div>,
          ]}
        />
      )}
      <Divider style={{ margin: '24px 0' }} />
      <Form.Item className={styles.stepActions}>
        <Popconfirm
          disabled={!result.can_send}
          placement="rightTop"
          title={formatMessage(
            { id: 'compose-form.step3.confirm' },
            { s: <Link to="/page/term">{formatMessage({ id: 'global.use-term' })}</Link> },
          )}
          onConfirm={onValidateForm}
          okText={formatMessage({ id: 'component.accept' })}
          cancelText={formatMessage({ id: 'component.reject' })}
        >
          <Button
            type="primary"
            danger={!result.can_send}
            onClick={result.can_send ? onValidateForm : doValidate}
            loading={submitting || loadingDetails}
            className="pull-right"
          >
            {result.can_send ? (
              <FormattedMessage id="component.next" />
            ) : (
              <FormattedMessage id="components.try-again" />
            )}
          </Button>
        </Popconfirm>

        <Button onClick={onPrev} loading={submitting || loadingDetails} className="pull-left">
          <FormattedMessage id="component.prev" />
        </Button>
      </Form.Item>
    </div>
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
)(Step3);
