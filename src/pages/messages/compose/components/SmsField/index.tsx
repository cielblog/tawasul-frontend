import React, { ClipboardEvent, useState } from 'react';
import { Button, Col, Input, message, Row, Tag } from 'antd';
import { FormattedMessage, useIntl } from 'umi';
import { FormInstance } from 'antd/es/form';
import { calculateMessageParts, isContainsArabic } from '@/utils/utils';
import { EyeOutlined, NumberOutlined } from '@ant-design/icons';
import styles from './styles.less';

const { TextArea } = Input;

interface SmsFieldProps {
  form: FormInstance;
  defaultValue?: string;
}

const SmsField: React.FC<SmsFieldProps> = (props) => {
  const { form, defaultValue } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formatMessage } = useIntl();
  const [parts, setParts] = useState(calculateMessageParts(defaultValue!));
  const [view, setView] = useState<boolean>(false);
  const [length, setLength] = useState(defaultValue?.length);

  /**
   * This method should prevent enter on text,
   * if the message parts is exceeded the maximum.
   * @param e
   */
  function handleKeyDown(e: any) {
    // if (e.which < 0x20) {
    //   // e.which < 0x20, then it's not a printable character
    //   // e.which === 0 - Not a character
    //   return false     // Do nothing
    // }

    if (parts === 5 && e.key !== 'Backspace') {
      e.preventDefault();
    } else {
      handleChange(e);
    }

    return true;
  }

  function handlePaste(e: ClipboardEvent) {
    let tempValue = e.clipboardData.getData('text');
    tempValue = tempValue.replace(/(\r\n|\n|\r)/gm, '');
    const tempParts = calculateMessageParts(tempValue + form.getFieldValue('message'));

    if (tempParts >= 5) {
      message.error(formatMessage({ id: 'compose-form.step3.paste-max-length-error' }));
      e.preventDefault();
    } else {
      handleChange(e);
    }
  }

  function handleChange(e: any) {
    const selector: HTMLElement | null = document.getElementById('smsField');
    const { value } = e.target;
    form.setFieldsValue({ message: value });
    setLength(value.length);

    // Change direction depends on Language.
    if (isContainsArabic(value)) {
      selector!.dir = 'rtl';
    } else {
      selector!.dir = 'ltr';
    }

    // calculate parts
    setParts(calculateMessageParts(value + defaultValue));
    setLength(value.length + defaultValue!.length);
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={!view ? 24 : 12}>
          <TextArea
            autoSize={{
              minRows: 6,
            }}
            id="smsField"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
        </Col>

        {view && (
          <Col span={12}>
            <div className={styles.speech}>
              <span>
                {defaultValue}
                {form.getFieldValue('message')}
              </span>
            </div>
          </Col>
        )}
      </Row>

      <div className="pull-left">
        <Tag icon={<NumberOutlined />} color="default">
          <FormattedMessage id="compose-form.sms-field.length" values={{ count: length }} />
        </Tag>
        <Tag icon={<NumberOutlined />} color="default">
          <FormattedMessage id="compose-form.sms-field.parts" values={{ count: parts, max: 5 }} />
        </Tag>
      </div>
      <Button
        type="dashed"
        size="small"
        className="pull-right"
        icon={<EyeOutlined />}
        onClick={() => {
          if (view) setView(false);
          if (!view) setView(true);
        }}
      >
        &nbsp;
        <FormattedMessage id="compose-form.sms-field.view" />
        &nbsp;
      </Button>
    </>
  );
};
export default SmsField;
