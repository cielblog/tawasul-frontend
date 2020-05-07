import {Alert, Checkbox} from 'antd';
import React, {useState} from 'react';
import {AnyAction, connect, Dispatch, FormattedMessage, useIntl} from 'umi';
import {StateType} from './model';
import styles from './style.less';
import {LoginParamsType} from './service';
import LoginFrom from './components/Login';

const {Tab, UserName, Password, Mobile, Captcha, Submit} = LoginFrom;

interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
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
  const {userLogin = {}, submitting} = props;
  const {status, type: loginType, error, failed} = userLogin;
  const [autoLogin, setAutoLogin] = useState(false);
  const [type, setType] = useState<string>('account');
  const {formatMessage} = useIntl();

  const handleSubmit = (values: LoginParamsType) => {
    const {dispatch} = props;
    dispatch({
      type: 'userLogin/login',
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
        <Tab key="account" tab={formatMessage({id: 'userandlogin.login.tab-login-credentials'})}>
          {status === 'error' && !submitting && (
            <LoginMessage content={error}/>
          )}

          <UserName
            name="username"
            placeholder={formatMessage({id: 'userandlogin.login.username'})}
            rules={[
              {
                required: true,
                message: formatMessage({id: 'userandlogin.username.required'}),
              },
            ]}
            disabled={!!submitting}
          />
          <Password
            name="password"
            placeholder={formatMessage({id: 'userandlogin.login.password'})}
            rules={[
              {
                required: true,
                message: formatMessage({id: 'userandlogin.password.required'}),
              },
            ]}
            disabled={!!submitting}

          />
        </Tab>
        {/*<Tab key="mobile" tab="手机号登录">*/}
        {/*  {status === 'error' && loginType === 'mobile' && !submitting && (*/}
        {/*    <LoginMessage content="验证码错误"/>*/}
        {/*  )}*/}
        {/*  <Mobile*/}
        {/*    name="mobile"*/}
        {/*    placeholder="手机号"*/}
        {/*    rules={[*/}
        {/*      {*/}
        {/*        required: true,*/}
        {/*        message: '请输入手机号！',*/}
        {/*      },*/}
        {/*      {*/}
        {/*        pattern: /^1\d{10}$/,*/}
        {/*        message: '手机号格式错误！',*/}
        {/*      },*/}
        {/*    ]}*/}
        {/*  />*/}
        {/*  <Captcha*/}
        {/*    name="captcha"*/}
        {/*    placeholder="验证码"*/}
        {/*    countDown={120}*/}
        {/*    getCaptchaButtonText=""*/}
        {/*    getCaptchaSecondText="秒"*/}
        {/*    rules={[*/}
        {/*      {*/}
        {/*        required: true,*/}
        {/*        message: '请输入验证码！',*/}
        {/*      },*/}
        {/*    ]}*/}
        {/*  />*/}
        {/*</Tab>*/}
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            <FormattedMessage id="userandlogin.login.remember-me"/>
          </Checkbox>
          <a
            className="pull-right"
          >
            <FormattedMessage id="userandlogin.login.forgot-password"/>
          </a>
        </div>
        <Submit loading={submitting}><FormattedMessage id="userandlogin.login.login"/></Submit>
        {/*<div className={styles.other}>*/}
        {/*  其他登录方式*/}
        {/*  <AlipayCircleOutlined className={styles.icon}/>*/}
        {/*  <TaobaoCircleOutlined className={styles.icon}/>*/}
        {/*  <WeiboCircleOutlined className={styles.icon}/>*/}
        {/*  <Link className={styles.register} to="/user/register">*/}
        {/*    注册账户*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </LoginFrom>
    </div>
  );
};

export default connect(
  ({
     userLogin,
     loading,
   }: {
    userLogin: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userLogin,
    submitting: loading.effects['userLogin/login'],
  }),
)(Login);
