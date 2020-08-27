import React, { FC } from 'react';
import { FormattedMessage } from 'umi';
import { Col, Row, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import ChartCard from '@/pages/desktop/analysis/components/ChartCard';
import { DesktopData } from '@/pages/desktop/analysis/data';
import { CurrentUser } from '@/models/user';

interface StatisticsProps {
  general: DesktopData['general'];
  user?: CurrentUser;
  loading?: boolean;
}

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const Statistics: FC<StatisticsProps> = (props) => {
  const { general, user, loading } = props;

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="desktop.statistics.general.messages" />}
          action={
            <Tooltip
              title={
                <FormattedMessage
                  id="dashboardandanalysis.analysis.introduce"
                  defaultMessage="Introduce"
                />
              }
            >
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => general.countMessages}
          contentHeight={46}
        />
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="desktop.statistics.general.groups" />}
          action={
            <Tooltip
              title={
                <FormattedMessage
                  id="dashboardandanalysis.analysis.introduce"
                  defaultMessage="Introduce"
                />
              }
            >
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => general.countGroups}
          contentHeight={46}
        />
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="desktop.statistics.general.myBalance" />}
          action={
            <Tooltip
              title={
                <FormattedMessage
                  id="dashboardandanalysis.analysis.introduce"
                  defaultMessage="Introduce"
                />
              }
            >
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => (user ? user?.freeBalance + user?.paidBalance : 0)}
          contentHeight={46}
        />
      </Col>
    </Row>
  );
};

export default Statistics;
