import { connect, ConnectProps, getLocale } from 'umi';
import React, { useEffect } from 'react';
import { ConnectState } from '@/models/connect';
import { ConfigProvider } from 'antd';
import { setRequestLocale } from '@/utils/request';

export interface MasterLayoutProps extends Partial<ConnectProps> {}

const UserLayout: React.FC<MasterLayoutProps> = (props) => {
  const { children } = props;

  useEffect(() => {
    document.getElementsByTagName('html')[0].dir = getLocale() === 'ar-EG' ? 'rtl' : 'ltr';

    setRequestLocale(getLocale());
  });
  return (
    <ConfigProvider direction={getLocale() === 'ar-EG' ? 'rtl' : 'ltr'}>{children}</ConfigProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
