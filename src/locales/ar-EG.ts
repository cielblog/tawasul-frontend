import component from './ar-EG/component';
import globalHeader from './ar-EG/globalHeader';
import menu from './ar-EG/menu';
import pwa from './ar-EG/pwa';
import settingDrawer from './ar-EG/settingDrawer';
import settings from './ar-EG/settings';

export default {
  'appname': 'نظام تواصل',
  'navBar.lang': 'اللغات',
  'layout.user.link.help': 'المساعدة',
  'layout.user.link.privacy': 'سياسة الخصوصية',
  'layout.user.link.terms': 'الشروط والأحكام',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
