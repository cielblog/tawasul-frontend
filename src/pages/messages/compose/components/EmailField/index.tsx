import React from 'react';
import { connect, getLocale } from 'umi';
// import { useIntl } from 'umi'
import { FormInstance } from 'antd/es/form';
// Require Editor JS files.
import 'froala-editor/js/plugins.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require language
import 'froala-editor/js/languages/ar';

import EditorComponent from 'react-froala-wysiwyg';
import { AuthModelState } from '@/models/auth';
import { viewEmail } from '@/pages/messages/compose/service';
import FroalaEditor from 'froala-editor';
import { EyeOutlined } from '@ant-design/icons-svg';
import { renderIconDefinitionToSVGElement } from '@ant-design/icons-svg/es/helpers';

// Include special components if required.
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// import FroalaEditorA from 'react-froala-wysiwyg/FroalaEditorA';
// import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';
// import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
// import FroalaEditorInput from 'react-froala-wysiwyg/FroalaEditorInput';

// import styles from './styles.less';

interface SmsFieldProps {
  form: FormInstance;
  defaultValue?: string;
  token?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EmailField: React.FC<SmsFieldProps> = (props) => {
  // const { token, form, defaultValue } = props;
  // const { formatMessage } = useIntl();
  // const [toggleView, setToggleView] = useState(false);
  // const [viewContent, setViewContent] = useState(false);

  const viewTemplateIcon = renderIconDefinitionToSVGElement(EyeOutlined, {});
  FroalaEditor.RegisterCommand('viewTemplate', {
    title: 'Insert variable',
    icon: viewTemplateIcon,
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callback(cmd: any, val: any) {
      const data: any = {
        subject: 'test',
        message: 'test',
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      viewEmail(data).then((response) => {});
    },
  });

  return (
    <>
      <EditorComponent
        tag="textarea"
        config={{
          imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
          toolbarButtons: {
            moreText: {
              buttons: [
                'bold',
                'italic',
                'underline',
                'strikeThrough',
                'subscript',
                'superscript',
                'fontFamily',
                'fontSize',
                'textColor',
                'backgroundColor',
                'inlineClass',
                'inlineStyle',
                'clearFormatting',
              ],
            },
            moreParagraph: {
              buttons: [
                'alignLeft',
                'alignCenter',
                'alignRight',
                'formatOLSimple',
                'alignJustify',
                'formatOL',
                'formatUL',
                'paragraphFormat',
                'paragraphStyle',
                'lineHeight',
                'outdent',
                'indent',
                'quote',
              ],
            },
            moreRich: {
              buttons: [
                'insertLink',
                'insertImage',
                'insertTable',
                'emoticons',
                'specialCharacters',
                'insertHR',
              ],
            },
            moreMisc: {
              buttons: [
                'viewTemplate',
                'undo',
                'redo',
                'fullscreen',
                'print',
                'getPDF',
                'spellChecker',
                'selectAll',
                'html',
                'help',
              ],
              align: 'right',
              buttonsVisible: 2,
            },
          },
          key: 'CTD5xD3D2D2A1A3B8wgD-13B-11D5uugA2gtjC5D4C3E3J2B7A6C4A4A2=',
          language: getLocale() === 'ar-EG' ? 'ar' : 'en',
          direction: getLocale() === 'ar-EG' ? 'rtl' : 'ltr',
          heightMax: 500,
          events: {
            'image.beforeUpload': function (images: Blob[]) {
              // Do something here.
              // this is the editor instance.
              console.log(images);
            },
          },
        }}
      />
    </>
  );
};
export default connect(({ auth }: { auth: AuthModelState }) => ({
  token: auth.token,
}))(EmailField);
