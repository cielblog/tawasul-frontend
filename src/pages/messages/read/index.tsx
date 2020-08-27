import React, { Component } from 'react';
import { Badge, Card, Col, Dropdown, Menu, Row, Skeleton, Spin, Statistic, Tooltip } from 'antd';
import {
  connect,
  Dispatch,
  FormattedMessage,
  injectIntl,
  useIntl,
  WrappedComponentProps,
} from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { MessageModalState } from '@/pages/messages/model';
import { RouteComponentProps } from 'react-router';
import MasterWrapper from '@/components/MasterWrapper';
import { DeleteOutlined, ReloadOutlined, RocketOutlined } from '@ant-design/icons';
import { PieChart } from 'bizcharts';
import styles from './style.less';
import SmsIcon from './icons/sms.svg';
import EmailIcon from './icons/email.svg';
import NotificationIcon from './icons/notification.svg';

interface StateType {
  title: string;
  icon: string;
}

interface Params {
  id: string;
}

interface MessageReadProps extends RouteComponentProps<Params>, WrappedComponentProps {
  current?: MessageModalState['current'];
  loading: boolean;
  dispatch: Dispatch;
}

const PageHeaderContent: React.FC<{ current: MessageModalState['current'] }> = ({ current }) => {
  const loading = current && Object.keys(current).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.content} style={{ margin: 0 }}>
        <div className={styles.contentTitle}>
          {current?.subject || <FormattedMessage id="message-read.no-subject" />}
        </div>
        <div>{current?.sentAt}</div>
      </div>
    </div>
  );
};

const ExtraContent: React.FC<{ current: MessageModalState['current']; loading: boolean }> = ({
  current,
  loading,
}) => {
  const { formatMessage } = useIntl();

  const getImageType = (type: any) => {
    switch (type) {
      case 'sms':
        return <img src={SmsIcon} className={styles.typeimg} alt={current?.type} />;
      case 'email':
        return <img src={EmailIcon} className={styles.typeimg} alt={current?.type} />;

      case 'pushNotification':
        return <img src={NotificationIcon} className={styles.typeimg} alt={current?.type} />;

      default:
        return 'Invalid Type';
    }
  };

  const getState = (state: any): StateType => {
    switch (state) {
      case 'succeed':
        return {
          icon: 'success',
          title: formatMessage({ id: 'messages-list.field.state.succeed' }),
        };

      case 'accepted':
        return {
          icon: 'processing',
          title: formatMessage({ id: 'messages-list.field.state.accepted' }),
        };

      case 'need_approving':
        return {
          icon: 'default',
          title: formatMessage({ id: 'messages-list.field.state.need_approving' }),
        };

      case 'rejected':
        return {
          icon: 'warning',
          title: formatMessage({ id: 'messages-list.field.state.rejected' }),
        };

      case 'failed':
        return {
          icon: 'error',
          title: formatMessage({ id: 'messages-list.field.state.failed' }),
        };

      default:
        return { title: '', icon: '' };
    }
  };

  const state: any = getState(current?.state);
  return (
    <MasterWrapper>
      <Spin spinning={loading}>
        <div className={styles.extraContent}>
          <div className={styles.statItem}>
            <Statistic
              title={formatMessage({ id: 'message-read.number-recipients' })}
              value={current?.numberRecipients}
            />
          </div>
          <div className={styles.statItem}>
            <Tooltip title={formatMessage({ id: `message-read.type.${current?.type}` })}>
              <Statistic
                title={formatMessage({ id: 'message-read.type' })}
                valueRender={() => getImageType(current?.type)}
              />
            </Tooltip>
          </div>
          <div className={styles.statItem}>
            <Tooltip title={state.title}>
              <Statistic
                title={formatMessage({ id: 'message-read.state' })}
                valueRender={() => <Badge status={state.icon} />}
              />
            </Tooltip>
          </div>
          <div className={styles.statItem}>
            <Statistic title={formatMessage({ id: 'message-read.cost' })} value={current?.cost} />
          </div>
        </div>
      </Spin>
    </MasterWrapper>
  );
};

class MessageRead extends Component<MessageReadProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'messagesModel/fetchCurrent',
      payload: this.props.match.params.id,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndworkplace/clear',
    });
  }

  reload = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'messagesModel/fetchCurrent',
      payload: this.props.match.params.id,
    });
  };

  handleActionMenu = (e) => {
    switch (e.key) {
      case '1':
        this.reload();
        break;

      case '2':
        break;

      case '3':
        break;

      default:
    }
  };

  render() {
    const { current, loading, intl } = this.props;

    if (!current) {
      return null;
    }

    const ActionsMenu = (
      <Menu onClick={this.handleActionMenu}>
        <Menu.Item key="1" icon={<ReloadOutlined />}>
          <FormattedMessage id="message-read.reload-button" />
        </Menu.Item>
        <Menu.Item key="2" icon={<DeleteOutlined />}>
          <FormattedMessage id="message-read.archive-button" />
        </Menu.Item>
        <Menu.Item key="3" icon={<RocketOutlined />}>
          <FormattedMessage id="message-read.resend-button" />
        </Menu.Item>
      </Menu>
    );
    return (
      <MasterWrapper>
        <PageHeaderWrapper
          content={
            <Spin spinning={loading}>
              <PageHeaderContent current={current} />
            </Spin>
          }
          extraContent={<ExtraContent current={current} loading={loading} />}
        >
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card
                className={styles.projectList}
                style={{ marginBottom: 24 }}
                title={intl.formatMessage({ id: 'message-read.message-content' })}
                loading={loading}
              >
                <div dangerouslySetInnerHTML={{ __html: current!.message }} />
              </Card>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card
                style={{ marginBottom: 24 }}
                title={intl.formatMessage({ id: 'message-read.details' })}
                bordered={false}
                extra={
                  <Dropdown.Button overlay={ActionsMenu}>
                    <FormattedMessage id="message-read.controls" />
                  </Dropdown.Button>
                }
              />

              {current?.report && (
                <Card
                  bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
                  bordered={false}
                  title={intl.formatMessage({ id: 'message-read.report' })}
                  loading={loading}
                >
                  <PieChart
                    data={[
                      {
                        type: intl.formatMessage({
                          id: 'message-read.report.delivered_recipients',
                        }),
                        value: current?.report.delivered_recipients,
                      },
                      {
                        type: intl.formatMessage({
                          id: 'message-read.report.undelivered_recipients',
                        }),
                        value: current?.report.undelivered_recipients,
                      },
                      {
                        type: intl.formatMessage({ id: 'message-read.report.unknown_recipients' }),
                        value: current?.report.unknown_recipients,
                      },
                    ]}
                    radius={0.8}
                    angleField="value"
                    colorField="type"
                    label={{
                      visible: true,
                      type: 'outer',
                      offset: 20,
                    }}
                  />
                </Card>
              )}
            </Col>
          </Row>
        </PageHeaderWrapper>
      </MasterWrapper>
    );
  }
}

export default injectIntl(
  connect(
    ({
      messagesModel,
      loading,
    }: {
      messagesModel: MessageModalState;
      loading: {
        effects: {
          [key: string]: boolean;
        };
      };
    }) => ({
      current: messagesModel.current,
      loading: loading.effects['messagesModel/fetchCurrent'],
    }),
  )(MessageRead),
);
