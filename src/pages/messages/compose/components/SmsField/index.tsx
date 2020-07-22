import React, { useEffect } from 'react';
import { Input, Form } from 'antd';
import { useIntl } from 'umi';
// import styles from './styles.less';

const { TextArea } = Input;

interface SmsFieldProps {
  defaultValue?: string;
}

const SmsField: React.FC<SmsFieldProps> = (props) => {
  const { formatMessage } = useIntl();
  const { defaultValue } = props;

  useEffect(() => {
    const selector: HTMLElement | null = document.getElementById('smsField');
    selector?.addEventListener('keyup', handleEvent);
    selector?.addEventListener('blur', handleEvent);
  });

  function handleEvent(event) {
    const element = event.target;
    const fixedValue = element.getAttribute('data-fixedvalue');
    if (element.value.indexOf(fixedValue) !== 0) {
      event.preventDefault();
      element.value = fixedValue;
    }
  }

  return (
    <>
      <Form.Item
        name="message"
        label={formatMessage({ id: 'compose-form.step1.enter-recipients' })}
      >
        <TextArea
          autoSize={{
            minRows: 6,
          }}
          id="smsField"
          data-fixedvalue={defaultValue}
        />
      </Form.Item>
    </>
  );
};
export default SmsField;
