import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect, ConnectProps, FormattedMessage, history } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { AuthModelState } from '@/models/auth';
import { getLocale } from '@@/plugin-locale/localeExports';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: CurrentUser;
  auth: AuthModelState;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'auth/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  getShortName = (name: string | null | undefined): string => {
    const tempName: any = name;
    if (!tempName) {
      return 'N/A';
    }

    const names: string[] = tempName.split(' ');
    if (names.length > 1) {
      return `${names[0].charAt(0).toUpperCase()}${names[names.length - 1]
        .charAt(0)
        .toUpperCase()}`;
    }

    return tempName.charAt(0).toUpperCase();
  };

  getFullName = (name: any): string => {
    const tempName = name;
    if (!tempName) {
      return 'N/A';
    }

    const names: string[] = tempName.split(' ');
    if (names.length > 1) {
      return `${names[0].charAt(0).toUpperCase()}${names[0].slice(1)} ${names[names.length - 1]
        .charAt(0)
        .toUpperCase()}${names[names.length - 1].slice(1)}`;
    }

    return `${tempName.charAt(0).toUpperCase()}${tempName.slice(1)}`;
  };

  render(): React.ReactNode {
    const { currentUser, menu } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick} id="sadat">
        {menu && (
          <Menu.Item key="settings">
            <UserOutlined />
            <FormattedMessage id="menu.account" />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="menu.account.logout" />
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.id ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar">
            {this.getShortName(currentUser?.englishName)}
          </Avatar>
          <span className={styles.name}>
            {this.getFullName(
              getLocale() === 'ar-EG' ? currentUser?.arabicName : currentUser?.englishName,
            )}
          </span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user, auth }: ConnectState) => ({
  currentUser: user.currentUser,
  auth,
}))(AvatarDropdown);
