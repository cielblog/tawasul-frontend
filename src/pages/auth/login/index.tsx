import { Alert, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Dispatch, FormattedMessage, useIntl, history } from 'umi';
import { AuthModelState } from '@/models/auth';
import { LoginParamsType } from '@/services/auth';
import LoginFrom from './components/Login';

import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginFrom;

interface LoginProps {
  dispatch: Dispatch;
  auth: AuthModelState;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { auth, submitting } = props;
  const { status, error } = auth;
  const [autoLogin, setAutoLogin] = useState(false);
  const [type, setType] = useState<string>('account');
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (auth.token) {
      history.push('/');
    }
  }, []);

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'auth/login',
      payload: {
        data: values,
        keepSession: autoLogin,
        type,
      },
    });
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab={formatMessage({ id: 'userandlogin.login.tab-login-credentials' })}>
          {status === 'error' && !submitting && <LoginMessage content={error} />}

          <UserName
            name="username"
            placeholder={formatMessage({ id: 'userandlogin.login.username' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandlogin.username.required' }),
              },
            ]}
            disabled={!!submitting}
          />
          <Password
            name="password"
            placeholder={formatMessage({ id: 'userandlogin.login.password' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandlogin.password.required' }),
              },
            ]}
            disabled={!!submitting}
          />
        </Tab>
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            <FormattedMessage id="userandlogin.login.remember-me" />
          </Checkbox>
          <a className="pull-right">
            <FormattedMessage id="userandlogin.login.forgot-password" />
          </a>
        </div>
        <Submit loading={submitting}>
          <FormattedMessage id="userandlogin.login.login" />
        </Submit>
      </LoginFrom>
    </div>
  );
};

export default connect(
  ({
    auth,
    loading,
  }: {
    auth: AuthModelState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    auth,
    submitting: loading.effects['auth/login'],
  }),
)(Login);
