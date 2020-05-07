import {connect, ConnectProps, useIntl, getLocale} from 'umi';
import React, {useEffect} from 'react';
import {ConnectState} from '@/models/connect';
import {ConfigProvider} from "antd";

export interface MasterLayoutProps extends Partial<ConnectProps> {

}

const UserLayout: React.FC<MasterLayoutProps> = (props) => {
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const {formatMessage} = useIntl();

  useEffect(() => {
    document.getElementsByTagName('html')[0].dir = getLocale() === "ar-EG" ? 'rtl' : 'ltr';
  })
  return (
    <ConfigProvider direction={getLocale() === "ar-EG" ? 'rtl' : 'ltr'}>
      {children}
    </ConfigProvider>
  );
};

export default connect(({settings}: ConnectState) => ({...settings}))(UserLayout);
