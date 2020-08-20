/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  BasicLayoutProps as ProLayoutProps,
  DefaultFooter,
  MenuDataItem,
  SettingDrawer,
  Settings,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { connect, Dispatch, FormattedMessage, Link, useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import jwt from 'jwt-decode';
import MasterLayout from '@/layouts/MasterLayout';
// Assets
import logo from '../assets/smallLogo.png';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  token: string | null;
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright="2019 蚂蚁金服体验技术部出品"
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    token,
  } = props;

  const { formatMessage } = useIntl();

  function checkTokenExpired(t: string) {
    try {
      const decodedToken: any = jwt(t);
      const now = Math.round(new Date().getTime() / 1000);
      return now < decodedToken.exp;
    } catch (e) {
      console.log('invalid token');
      return false;
    }
  }

  useEffect(() => {
    if (token && checkTokenExpired(token)) {
      if (dispatch) {
        dispatch({
          type: 'user/fetchCurrent',
        });
      }
    }
  }, []);

  if (token) {
    // Check token
    if (!checkTokenExpired(token)) {
      return (
        <Result
          status="error"
          title={formatMessage({ id: 'component.token-expired' })}
          extra={
            <MasterLayout>
              <p>
                <FormattedMessage id="component.token-expired.description" />
              </p>
              <Button
                type="primary"
                onClick={() => {
                  dispatch({
                    type: 'auth/logout',
                  });
                }}
              >
                <FormattedMessage id="menu.account.login" />
              </Button>
            </MasterLayout>
          }
        />
      );
    }
  } else {
    dispatch({
      type: 'auth/logout',
    });
    return <>Session error</>;
  }

  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <MasterLayout>
      <ProLayout
        logo={logo}
        formatMessage={formatMessage}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => defaultFooterDom}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </MasterLayout>
  );
};

export default connect(({ global, settings, auth }: ConnectState) => ({
  collapsed: global.collapsed,
  token: auth.token,
  settings,
}))(BasicLayout);
