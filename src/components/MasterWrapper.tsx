import { ConnectProps, getLocale } from 'umi';
import React from 'react';
import { ConfigProvider } from 'antd';

export interface MasterWrapperProps extends Partial<ConnectProps> {}

const MasterWrapper: React.FC<MasterWrapperProps> = (props) => {
  const { children } = props;
  return (
    <ConfigProvider direction={getLocale() === 'ar-EG' ? 'rtl' : 'ltr'}>{children}</ConfigProvider>
  );
};

export default MasterWrapper;
