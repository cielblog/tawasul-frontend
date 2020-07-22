import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Tag } from 'antd';
import { FormattedMessage, useIntl } from 'umi';
import { NumberOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';
import { calculateMessageParts, isContainsArabic } from '@/utils/utils';
// import styles from './styles.less';

const { TextArea } = Input;

interface SmsFieldProps {
  form: FormInstance;
  defaultValue?: string;
}

const SmsField: React.FC<SmsFieldProps> = (props) => {
  const { form, defaultValue } = props;
  const { formatMessage } = useIntl();
  const [parts, setParts] = useState(calculateMessageParts(defaultValue!));
  const [length, setLength] = useState(defaultValue?.length);

  useEffect(() => {
    const selector: HTMLElement | null = document.getElementById('smsField');
    // Readonly text
    selector?.addEventListener('keyup', handleReadOnlyTextEvent);
    selector?.addEventListener('blur', handleReadOnlyTextEvent);

    // Maximum length
    // eslint-disable-next-line func-names
    selector?.addEventListener('keydown', function (e) {
      if (parts === 5) {
        e.preventDefault();
        return false;
      }

      return true;
    });
  });

  function handleReadOnlyTextEvent(event: any) {
    const element = event.target;
    if (element.value.indexOf(defaultValue) !== 0) {
      event.preventDefault();
      form.setFieldsValue({ message: defaultValue });
      setLength(defaultValue!.length);
      setParts(calculateMessageParts(defaultValue!));
    }
  }

  function handleChange(e: any) {
    const selector: HTMLElement | null = document.getElementById('smsField');
    const { value } = e.target;
    setLength(value.length);

    // Change direction depends on Language.
    if (isContainsArabic(value)) {
      selector!.dir = 'rtl';
    } else {
      selector!.dir = 'ltr';
    }

    // calculate parts
    setParts(calculateMessageParts(value));
  }

  return (
    <>
      <Form.Item
        name="message"
        label={formatMessage({ id: 'compose-form.step1.message' })}
        initialValue={defaultValue}
        rules={[{ required: true, message: formatMessage({ id: 'compose-form.field-required' }) }]}
      >
        <TextArea
          autoSize={{
            minRows: 6,
          }}
          id="smsField"
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item>
        <div className="pull-left">
          <Tag icon={<NumberOutlined />} color="default">
            <FormattedMessage id="compose-form.sms-field.length" values={{ count: length }} />
          </Tag>
          <Tag icon={<NumberOutlined />} color="default">
            <FormattedMessage id="compose-form.sms-field.parts" values={{ count: parts, max: 5 }} />
          </Tag>
        </div>
        <Button type="link" className="pull-right">
          <FormattedMessage id="compose-form.sms-field.rules" />
        </Button>
      </Form.Item>
    </>
  );
};
export default SmsField;
