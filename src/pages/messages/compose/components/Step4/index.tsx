import React, { useEffect } from 'react';
import { Alert, Result, Typography } from 'antd';
import { connect, Dispatch, FormattedMessage, useIntl } from 'umi';
import Lottie from 'react-lottie';
// Types
import { StateType } from '../../model';
// Assets
import styles from './index.less';
import * as coolIcon from './icons/cool.json';
import * as successIcon from './icons/success.json';

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

  if (!data) {
    return null;
  }

  function getError(e: any) {
    // Validation error
    if (e.hasOwnProperty('data')) {
      // const errors: any[] = e?.data;
      // const lerrors: string[] = errors.map(object => `${object?.field  } ${  object?.message}`)
    }
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
            <div>
              <Alert type="error" message={getError(server?.error)} />
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
