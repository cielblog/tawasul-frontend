import React, { useState } from 'react';
import { Form, Button, Divider, Select } from 'antd';
import { connect, Dispatch, useIntl, FormattedMessage } from 'umi';
import { StateType } from '../../model';
import styles from './index.less';

const { Option } = Select;

interface Step1Props {
  data?: StateType['step'];
  dispatch?: Dispatch;
}

const Step1: React.FC<Step1Props> = (props) => {
  const { formatMessage } = useIntl();
  const { dispatch, data } = props;
  const [form] = Form.useForm();
  const { getFieldValue, setFieldsValue } = form;
  const [recipientDropDown, toggleRecipientDropDown] = useState(false);
  const [destinationType, setDestinationType] = useState(data?.destination);
  const [messageType, setMessageType] = useState(data?.type);

  if (!data) {
    return null;
  }
  const { validateFields } = form;
  const onValidateForm = async () => {
    const values = await validateFields();
    if (dispatch) {
      dispatch({
        type: 'composeMessage/saveForm',
        payload: values,
      });
      dispatch({
        type: 'composeMessage/saveCurrentStep',
        payload: 'message-content',
      });
    }
  };

  const recipientValidator = (
    rule: any,
    values: any[],
    callback: (arg0: string | undefined) => void,
  ) => {
    if (values) {
      if (values.length === 0) {
        callback(formatMessage({ id: 'compose-form.field-required' }));
      }

      const regex: RegExp =
        messageType === 'sms'
          ? /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
          : /^[a-z0-9](\.?[a-z0-9]){5,}@(student\.)?ksu\.edu\.sa$/;
      const errorMsg: string =
        messageType === 'sms'
          ? 'compose-form.field-mobile-wrong'
          : 'compose-form.field-email-wrong';
      const invalidInputs: string[] = values.filter((value: string) => !value.match(regex));
      if (invalidInputs.length === 0) {
        // @ts-ignore
        callback();
      } else if (invalidInputs.length) {
        callback(formatMessage({ id: errorMsg }, { val: invalidInputs.join('') }));
      }
      if (invalidInputs.length > 0) {
        toggleRecipientDropDown(false);
        const tempValues: string[] = getFieldValue('recipients');
        const newValues = tempValues.filter((value: string) => invalidInputs.indexOf(value) === -1);
        setFieldsValue({
          recipients: newValues,
        });
      }
    } else {
      callback(formatMessage({ id: 'compose-form.field-required' }));
    }
  };

  const handleDestination = (value: any) => {
    setDestinationType(value);
  };
  const handleMessageType = (value: any) => {
    form.setFieldsValue({ recipients: [] });
    setMessageType(value);
  };
  return (
    <>
      <Form form={form} layout="vertical" className={styles.stepForm} initialValues={data}>
        <Form.Item
          name="type"
          label={formatMessage({ id: 'compose-form.step1.type' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'compose-form.field-required' }),
            },
          ]}
        >
          <Select
            placeholder={formatMessage({ id: 'compose-form.please-choose' })}
            onChange={handleMessageType}
          >
            <Option value="email">
              <FormattedMessage id="compose-form.step1.type-email" />
            </Option>
            <Option value="sms">
              <FormattedMessage id="compose-form.step1.type-sms" />
            </Option>
            <Option value="pn">
              <FormattedMessage id="compose-form.step1.type-pn" />
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="destination"
          label={formatMessage({ id: 'compose-form.step1.destination' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'compose-form.field-required' }),
            },
          ]}
        >
          <Select
            placeholder={formatMessage({ id: 'compose-form.please-choose' })}
            onChange={handleDestination}
          >
            <Option value="recipients">
              <FormattedMessage id="compose-form.step1.destination-recipients" />
            </Option>
            <Option value="group">
              <FormattedMessage id="compose-form.step1.destination-group" />
            </Option>
          </Select>
        </Form.Item>

        {destinationType === 'recipients' && (
          <Form.Item
            name="recipients"
            label={formatMessage({ id: 'compose-form.step1.enter-recipients' })}
            rules={[
              {
                validator: recipientValidator,
              },
            ]}
          >
            <Select
              mode="tags"
              placeholder={formatMessage({ id: 'compose-form.please-enter-recipients' })}
              open={recipientDropDown}
              onMouseLeave={() => toggleRecipientDropDown(false)}
              onKeyDown={() => toggleRecipientDropDown(true)}
            />
          </Form.Item>
        )}

        {destinationType === 'group' && (
          <Form.Item
            name="group"
            label={formatMessage({ id: 'compose-form.step1.please-choose' })}
            rules={[
              {
                validator: recipientValidator,
              },
            ]}
          >
            <Select
              placeholder={formatMessage({ id: 'compose-form.please-enter-recipients' })}
              open={recipientDropDown}
              onMouseLeave={() => toggleRecipientDropDown(false)}
              onKeyDown={() => toggleRecipientDropDown(true)}
            />
          </Form.Item>
        )}
        <Divider style={{ margin: '40px 0 24px' }} />
        <Form.Item className="pull-right">
          <Button type="primary" onClick={onValidateForm}>
            <FormattedMessage id="component.next" />
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default connect(({ composeMessage }: { composeMessage: StateType }) => ({
  data: composeMessage.step,
}))(Step1);
