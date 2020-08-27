import { connect, Dispatch } from 'umi';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import MasterWrapper from '@/components/MasterWrapper';
import Statistics from '@/pages/desktop/analysis/components/Statistics';
import { DesktopData } from '@/pages/desktop/analysis/data';
import { CurrentUser, UserModelState } from '@/models/user';
import PageLoading from './components/PageLoading';

interface AnalysisProps {
  dispatch: Dispatch;
  loadingGeneral: boolean;
  loadingUser: boolean;
  currentUser: CurrentUser;
  general: DesktopData['general'];
}

interface AnalysisState {}

class Desktop extends Component<AnalysisProps, AnalysisState> {
  state: AnalysisState = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'desktopModel/fetchGeneralStatistics',
    });
  }

  componentWillUnmount() {}

  render() {
    const { loadingGeneral, general, currentUser, loadingUser } = this.props;

    return (
      <MasterWrapper>
        <GridContent>
          <React.Fragment>
            <Suspense fallback={<PageLoading />}>
              <Statistics
                general={general}
                user={currentUser}
                loading={loadingGeneral || loadingUser}
              />
            </Suspense>
          </React.Fragment>
        </GridContent>
      </MasterWrapper>
    );
  }
}

export default connect(
  ({
    desktopModel,
    user,
    loading,
  }: {
    desktopModel: DesktopData;
    user: UserModelState;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    desktopModel,
    loadingGeneral: loading.effects['desktopModel/fetchGeneralStatistics'],
    loadingUser: loading.effects['user/fetch'],
    general: desktopModel.general,
    currentUser: user.currentUser,
  }),
)(Desktop);
