import React, { FC, useState } from 'react';
import { useIntl } from 'umi';
import { GroupMember } from '@/pages/groups/edit/model';
import { Button, List, Modal, Popconfirm } from 'antd';
import { paginate } from '@/utils/utils';
import { DeleteOutlined } from '@ant-design/icons';
import { Dispatch } from '@@/plugin-dva/connect';
import { FormInstance } from 'antd/lib/form';
import MembersForm from '@/pages/groups/edit/components/MembersForm';

interface MembersListProps {
  members: GroupMember[];
  dispatch: Dispatch;
  form: FormInstance;
}

const MembersList: FC<MembersListProps> = (props) => {
  const { members, dispatch, form } = props;
  const { formatMessage } = useIntl();
  const [addModalViability, setAddModalViability] = useState<boolean>(false);

  const showEmailAndMobile = (item: any): string => {
    if (item.email && item.mobile) {
      return `${item.email} - ${item.mobile}`;
    }
    if (item.email) {
      return item.email;
    }

    return item.mobile;
  };

  const remove = (item: GroupMember): void => {
    const array = members.filter((member) => member !== item);
    form.setFieldsValue({
      members: array,
    });

    if (dispatch) {
      dispatch({
        type: 'groupEdit/saveMembers',
        payload: array,
      });
    }
  };

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        bordered
        pagination={{
          onChange: (page) => {
            paginate(members, 5, page);
          },
          pageSize: 5,
        }}
        header={
          <Button type="dashed" onClick={() => setAddModalViability(true)}>
            {formatMessage({ id: 'group-edit.members-list.add' })}
          </Button>
        }
        dataSource={members}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            actions={[]}
            extra={
              <Popconfirm
                placement="topLeft"
                title={formatMessage({ id: 'group-edit.field.members.confirm-delete' })}
                onConfirm={() => remove(item)}
                okText={formatMessage({ id: 'component.confirm' })}
                cancelText={formatMessage({ id: 'component.reject' })}
              >
                <a>
                  <DeleteOutlined />
                </a>
              </Popconfirm>
            }
          >
            <List.Item.Meta title={item.name} description={showEmailAndMobile(item)} />
          </List.Item>
        )}
      />
      {/*  Add Modal */}
      <Modal
        title={formatMessage({ id: 'group-edit.members-list.add' })}
        footer=""
        visible={addModalViability}
        onCancel={() => setAddModalViability(false)}
      >
        <MembersForm instance={form} dispatch={dispatch} members={members} />
      </Modal>
    </>
  );
};

export default MembersList;
