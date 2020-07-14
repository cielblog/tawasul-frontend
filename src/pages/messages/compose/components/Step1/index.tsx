import React, { useState } from 'react';
import { Form, Button, Divider, Input, Select } from 'antd';
import { connect, Dispatch, useIntl, FormattedMessage } from 'umi';
import { StateType } from '../../model';
import styles from './index.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
interface Step1Props {
  data?: StateType['step'];
  dispatch?: Dispatch<any>;
}

const Step1: React.FC<Step1Props> = (props) => {
  const { formatMessage } = useIntl();
  const { dispatch, data } = props;
  const [form] = Form.useForm();
  const { getFieldValue, setFieldsValue } = form;
  const [recipientDropDown, toggleRecipientDropDown] = useState(false);
  const [destinationType, setDestinationType] = useState('');

  if (!data) {
    return null;
  }
  const { validateFields } = form;
  const onValidateForm = async () => {
    const values = await validateFields();
    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/saveStepFormData',
        payload: values,
      });
      dispatch({
        type: 'formAndstepForm/saveCurrentStep',
        payload: 'confirm',
      });
    }
  };

  const mobileValidator = (rule, values, callback) => {
    const regex: RegExp = /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
    const invalidInputs: string[] = values.filter((value: string) => !value.match(regex));
    if (invalidInputs.length === 0) {
      callback();
    } else if (invalidInputs.length === 1) {
      callback(
        formatMessage(
          { id: 'compose-form.field-mobile-wrong' },
          { mobile: invalidInputs.join('') },
        ),
      );
    } else {
      callback(
        `${invalidInputs.slice(0, -1).join(', ')} and ${invalidInputs.slice(
          -1,
        )} are not valid emails`,
      );
    }

    if (invalidInputs.length > 0) {
      toggleRecipientDropDown(false);
      const tempValues: string[] = getFieldValue('recipients');
      const newValues = tempValues.filter((value: string) => invalidInputs.indexOf(value) === -1);
      setFieldsValue({
        recipients: newValues,
      });
    }
  };

  const handleDestination = (value) => {
    setDestinationType(value);
  };
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        className={styles.stepForm}
        hideRequiredMark
        initialValues={data}
      >
        <Form.Item
          name="type"
          label={formatMessage({ id: 'compose-form.step1.type' })}
          rules={[{ required: true, message: '请选择付款账户' }]}
        >
          <Select placeholder={formatMessage({ id: 'compose-form.please-choose' })}>
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
                validator: mobileValidator,
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
                validator: mobileValidator,
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
        <Form.Item
          label="收款人姓名"
          name="receiverName"
          rules={[{ required: true, message: '请输入收款人姓名' }]}
        >
          <Input placeholder="请输入收款人姓名" />
        </Form.Item>
        <Form.Item
          label="转账金额"
          name="amount"
          rules={[
            { required: true, message: '请输入转账金额' },
            {
              pattern: /^(\d+)((?:\.\d+)?)$/,
              message: '请输入合法金额数字',
            },
          ]}
        >
          <Input prefix="￥" placeholder="请输入金额" />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
      <Divider style={{ margin: '40px 0 24px' }} />
      <div className={styles.desc}>
        <h3>说明</h3>
        <h4>转账到支付宝账户</h4>
        <p>
          如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
        </p>
        <h4>转账到银行卡</h4>
        <p>
          如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
        </p>
      </div>
    </>
  );
};

export default connect(({ composeMessage }: { composeMessage: StateType }) => ({
  data: composeMessage.step,
}))(Step1);
