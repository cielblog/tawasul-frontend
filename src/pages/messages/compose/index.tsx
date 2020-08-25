import React, { useEffect, useState } from 'react';
import { Card, Steps } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MasterWrapper from '@/components/MasterWrapper';
import { connect, Dispatch, useIntl } from 'umi';
import { StateType } from './model';

import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';

import styles from './style.less';

const { Step } = Steps;

interface StepFormProps {
  current: StateType['current'];
  data: StateType['step'];
  dispatch?: Dispatch;
}

const getCurrentStepAndComponent = (current?: string) => {
  switch (current) {
    case 'message-info':
      return { step: 0, component: <Step1 /> };
    case 'message-content':
      return { step: 1, component: <Step2 /> };
    case 'report':
      return { step: 2, component: <Step3 /> };
    case 'done':
      return { step: 3, component: <Step4 /> };
    default:
      return { step: 0, component: <Step1 /> };
  }
};

const ComposeMessage: React.FC<StepFormProps> = (props) => {
  const { formatMessage } = useIntl();
  const [stepComponent, setStepComponent] = useState<React.ReactNode>(<Step1 />);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { data, current, dispatch } = props;

  useEffect(() => {
    const { step, component } = getCurrentStepAndComponent(current);
    setCurrentStep(step);
    setStepComponent(component);
  }, [current]);

  // @ts-ignore
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (dispatch) {
      return () => {
        dispatch({
          type: 'composeMessage/reset',
        });
      };
    }
  }, []);
  return (
    <MasterWrapper>
      <PageHeaderWrapper content={formatMessage({ id: 'compose-form.description' })}>
        <Card bordered={false}>
          <>
            <Steps current={currentStep} className={styles.steps}>
              <Step title={formatMessage({ id: 'compose-form.step1-title' })} />
              <Step title={formatMessage({ id: 'compose-form.step2-title' })} />
              {data!.type === 'sms' && (
                <Step title={formatMessage({ id: 'compose-form.step3-title' })} />
              )}
              <Step title={formatMessage({ id: 'compose-form.step4-title' })} />
            </Steps>
            {stepComponent}
          </>
        </Card>
      </PageHeaderWrapper>
    </MasterWrapper>
  );
};

export default connect(({ composeMessage }: { composeMessage: StateType }) => ({
  current: composeMessage.current,
  data: composeMessage.step,
}))(ComposeMessage);
