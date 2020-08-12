import React, { useState } from 'react';
import { FormattedMessage, getLocale, useIntl } from 'umi';
// import { useIntl } from 'umi'
import { FormInstance } from 'antd/lib/form';
import EditorComponent from 'react-froala-wysiwyg';

// @ts-ignore
import FroalaEditor from 'froala-editor';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Editor JS files.
import 'froala-editor/js/plugins.pkgd.min.js';
// Require language
import 'froala-editor/js/languages/ar';
import { uploadEmailImage, viewEmail } from '@/pages/messages/compose/service';
import { renderIconDefinitionToSVGElement } from '@ant-design/icons-svg/es/helpers';
import { EyeOutlined } from '@ant-design/icons-svg/es';
import { Button, Modal } from 'antd';

// Include special components if required.
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// import FroalaEditorA from 'react-froala-wysiwyg/FroalaEditorA';
// import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';
// import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
// import FroalaEditorInput from 'react-froala-wysiwyg/FroalaEditorInput';

// import styles from './styles.less';

interface EmailFieldProps {
  form: FormInstance;
}

const EmailField: React.FC<EmailFieldProps> = (props) => {
  const { form } = props;
  // const { formatMessage } = useIntl();
  const [editorInstance, setEditorInstance] = useState<FroalaEditor | null | undefined>(null);
  const [viewTemplateModal, setViewTemplateModal] = useState<boolean>(false);
  const [viewTemplateModalContent, setViewTemplateModalContent] = useState<any>(null);
  const { formatMessage } = useIntl();

  function handleManualController(initControls: FroalaEditor) {
    setEditorInstance(initControls);
    initControls.initialize();
  }

  function handleCloseViewTemplateModal() {
    setViewTemplateModal(false);
    setViewTemplateModalContent(null);
  }

  function handleMessageChange(editor: FroalaEditor) {
    const html = editor.html.get(true);
    form.setFieldsValue({
      message: html,
    });
  }

  if (editorInstance) {
    const editor = editorInstance.getEditor();
    editor.opts = {
      ...editor.opts,
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
      imageManagerLoadURL: '/v1/email/attachment-manager',
      imageUpload: true,
      language: getLocale() === 'ar-EG' ? 'ar' : 'en',
      direction: getLocale() === 'ar-EG' ? 'rtl' : 'ltr',
      heightMax: 500,
      events: {
        initialized: () => {
          // Do something here.
          // this is the editor instance.
        },
        'image.beforeUpload': (images: Blob[]) => {
          // const instance = this;
          const data = new FormData();
          data.append('image', images[0]);

          editor.image.showProgressBar();
          uploadEmailImage(data).then((response) => {
            editor.image.hideProgressBar();
            editor.image.insert(response.url, true, null, null, null);
          });
          return false;
        },
        contentChanged: () => handleMessageChange(editor),
        'paste.before': (e: any) => {
          const clipboardInstance: DataTransfer = e.clipboardData;
          const data = clipboardInstance.getData('text');
          editor.html.insert(data);
          return false;
        },
      },
    };

    // Custom button

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
          subject: form.getFieldValue('subject'),
          message: form.getFieldValue('message'),
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        viewEmail(data).then((response) => {
          setViewTemplateModalContent(response);
          setViewTemplateModal(true);
        });
      },
    });
  }

  return (
    <>
      <EditorComponent tag="textarea" onManualControllerReady={handleManualController} />

      {/* Preview Modal */}
      <Modal
        title={formatMessage({ id: 'compose-form.email-field.modal-title' })}
        visible={viewTemplateModal}
        // onOk={this.handleOk}
        onCancel={() => setViewTemplateModal(false)}
        footer={[
          [
            <Button key="ok" onClick={handleCloseViewTemplateModal}>
              <FormattedMessage id="component.close" />
            </Button>,
          ],
        ]}
        width="600px"
        bodyStyle={{ padding: 0 }}
      >
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: viewTemplateModalContent }} />
      </Modal>
    </>
  );
};
export default EmailField;
