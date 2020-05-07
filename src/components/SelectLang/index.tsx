import { GlobalOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { getLocale, setLocale, useIntl } from 'umi';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import SAFlag from'../../assets/flags/sa.png';
import USFlag from'../../assets/flags/us.png';

interface SelectLangProps {
  className?: string;
}

const SelectLang: React.FC<SelectLangProps> = (props) => {
  const { className } = props;
  const selectedLang = getLocale();
  const intl = useIntl();

  const changeLang = ({ key }: ClickParam): void => setLocale(key);

  const locales = ['ar-EG','en-US'];
  const languageLabels = {
    'ar-EG': 'العربية',
    'en-US': 'English',
  };
  const languageIcons = {
    'ar-EG': <img src={SAFlag} alt="🇸🇦"/>,
    'en-US': <img src={USFlag} alt="🇺🇸"/>,
  };
  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {locales.map((locale) => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <GlobalOutlined title={intl.formatMessage({id: "navBar.lang"})} />
      </span>
    </HeaderDropdown>
  );
};

export default SelectLang;
