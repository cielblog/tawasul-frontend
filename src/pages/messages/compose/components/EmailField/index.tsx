import React, { useEffect } from 'react';
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
import { uploadEmailImage } from '@/pages/messages/compose/service';

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

const EmailField: React.FC<SmsFieldProps> = (props) => {
  // const { token, form, defaultValue } = props;
  // const { formatMessage } = useIntl();

  useEffect(function () {
    console.log(props);
  }, []);
  return (
    <>
      <EditorComponent
        tag="textarea"
        config={{
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
          imageManagerLoadURL: '/v1/email/attachment-manager',
          imageUpload: true,
          language: getLocale() === 'ar-EG' ? 'ar' : 'en',
          direction: getLocale() === 'ar-EG' ? 'rtl' : 'ltr',
          heightMax: 500,
          events: {
            'image.beforeUpload': function (images) {
              // const instance = this;
              const data = new FormData();
              data.append('images[]', images[0]);

              uploadEmailImage(data).then((response) => {
                console.log(response);
              });

              return false;
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
