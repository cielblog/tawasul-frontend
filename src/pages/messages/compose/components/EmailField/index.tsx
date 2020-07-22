import React from 'react';
// import { useIntl } from 'umi'
import { FormInstance } from 'antd/es/form';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';

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
}

const EmailField: React.FC<SmsFieldProps> = (props) => {
  // const { form, defaultValue } = props;
  // const { formatMessage } = useIntl();

  console.log(props);
  return (
    <>
      <FroalaEditor />
    </>
  );
};
export default EmailField;
