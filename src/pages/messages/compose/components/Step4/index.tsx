import React, { ReactNode, useEffect } from 'react';
import { Alert, Button, Result, Typography } from 'antd';
import { connect, Dispatch, FormattedMessage, useIntl } from 'umi';
import Lottie from 'react-lottie';
// Types
import { StateType } from '../../model';
// Assets
import styles from './index.less';
import * as coolIcon from './icons/cool.json';
import * as successIcon from './icons/success.json';
import * as errorIcon from './icons/error.json';

const { Title } = Typography;

interface Step4Props {
  data: StateType['step'];
  server: StateType['server'];
  dispatch?: Dispatch;
  submitting?: boolean;
}

const Step4: React.FC<Step4Props> = (props) => {
  const { formatMessage } = useIntl();
  const { data, server, dispatch, submitting } = props;

  const iconOptions = (icon: any) => {
    return {
      loop: true,
      autoplay: true,
      animationData: icon?.default,
      rendererSettings: {},
    };
  };

  // When component mount, we gonna send the message,
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'composeMessage/submitStepForm',
        payload: {
          ...data,
        },
      });
    }
  }, []);

  function handleStartAgain() {
    if (dispatch) {
      dispatch({
        type: 'composeMessage/saveCurrentStep',
        payload: 'message-info',
      });
    }
  }

  if (!data) {
    return null;
  }

  function getError(e: any) {
    // Validation error
    if (e.hasOwnProperty('data')) {
      const errors: any[] = e?.data;

      const list: ReactNode[] = [];
      errors.forEach((errorElement, i) => {
        list.push(<li key={i}>{errorElement?.message}</li>);
      });

      return <Alert type="error" message={list} />;
    }

    return null;
  }
  return (
    <div className={styles.stepForm}>
      {submitting ? (
        <div className={styles.container}>
          <Title level={2}>
            <FormattedMessage id="compose-form.step4.sending" />
          </Title>
          <Title level={4}>
            <FormattedMessage id="compose-form.step4.details" />
          </Title>
          <Lottie options={iconOptions(coolIcon)} width={300} height={300} />
        </div>
      ) : (
        <div>
          {server?.status === 'error' ? (
            <div className={styles.errcontainer}>
              <Lottie options={iconOptions(errorIcon)} width={200} height={200} />
              <Title level={2}>
                <FormattedMessage id="compose-form.step4.sending-error-title" />
              </Title>

              {getError(server?.error)}

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button type="primary" onClick={handleStartAgain}>
                  العودة وتصحيح الأخطاء
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Result
                status="success"
                title={formatMessage({ id: 'compose-form.step4.done' })}
                subTitle={server?.error?.message}
                icon={<Lottie options={iconOptions(successIcon)} width={300} height={300} />}
              />
            </div>
          )}
        </div>
      )}
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
    submitting: loading.effects['composeMessage/submitStepForm'],
    data: composeMessage.step,
    server: composeMessage.server,
  }),
)(Step4);
