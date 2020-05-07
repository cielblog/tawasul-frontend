import React from 'react';
import {AnyAction, Dispatch, useIntl} from 'umi';
import {StateType} from './model';
import styles from '../style.less';
import {PageHeaderWrapper} from "@ant-design/pro-layout";

interface ComposeProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting?: boolean;
}

const Compose: React.FC<ComposeProps> = (props) => {
  const {formatMessage} = useIntl();

  return (
    <PageHeaderWrapper>
    <div className={styles.main}>
    </div>
    </PageHeaderWrapper>
  );
};

export default Compose
