import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Tree,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import {
  getOrganizationTree,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '../../api/organization';

const { Title } = Typography;

/**
 * 将后端返回的树形数据转换为 Ant Design Tree 需要的格式
 */
function convertToTreeData(list) {
  return list.map((item) => ({
    key: item.id,
    title: (
      <span>
        {item.name}
        <span style={{ color: '#999', marginLeft: 8, fontSize: 12 }}>
          ({item.code})
        </span>
      </span>
    ),
    data: item,
    children: item.children ? convertToTreeData(item.children) : [],
  }));
}

export default function Organizations() {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [parentOrg, setParentOrg] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  // 加载组织树
  const fetchTree = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrganizationTree();
      setTreeData(convertToTreeData(res.data || []));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  // 打开新建弹窗
  const handleCreate = (parentNode) => {
    setEditingOrg(null);
    setParentOrg(parentNode || null);
    form.resetFields();
    form.setFieldsValue({ sort: 0 });
    setModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (nodeData) => {
    setEditingOrg(nodeData);
    setParentOrg(null);
    form.setFieldsValue({
      name: nodeData.name,
      sort: nodeData.sort,
    });
    setModalVisible(true);
  };

  // 删除组织
  const handleDelete = async (id) => {
    try {
      await deleteOrganization(id);
      message.success('删除成功');
      fetchTree();
    } catch (err) {
      // 错误已在拦截器中提示
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setConfirmLoading(true);
      if (editingOrg) {
        // 编辑
        await updateOrganization(editingOrg.id, values);
        message.success('更新成功');
      } else {
        // 新建
        await createOrganization({
          ...values,
          parentId: parentOrg ? parentOrg.id : null,
        });
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchTree();
    } catch (err) {
      // 表单校验失败或请求错误
    } finally {
      setConfirmLoading(false);
    }
  };

  // 树节点右侧操作按钮
  const renderTitleWithActions = (nodeData) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingRight: 8,
        }}
      >
        <span>
          {nodeData.name}
          <span style={{ color: '#999', marginLeft: 8, fontSize: 12 }}>
            ({nodeData.code})
          </span>
        </span>
        <Space size={4}>
          <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            disabled={nodeData.level >= 5}
            onClick={(e) => {
              e.stopPropagation();
              handleCreate(nodeData);
            }}
          />
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(nodeData);
            }}
          />
          <Popconfirm
            title="确认删除该组织？"
            description="删除后不可恢复"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(nodeData.id);
            }}
            onCancel={(e) => e.stopPropagation()}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      </div>
    );
  };

  // 带操作按钮的树形数据
  const treeDataWithActions = (list) => {
    return list.map((item) => ({
      key: item.key,
      title: renderTitleWithActions(item.data),
      data: item.data,
      children: item.children ? treeDataWithActions(item.children) : [],
    }));
  };

  const modalTitle = editingOrg
    ? '编辑组织'
    : parentOrg
      ? `在「${parentOrg.name}」下新建子组织`
      : '新建根组织';

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <Space>
            <ApartmentOutlined />
            <Title level={5} style={{ margin: 0 }}>
              组织管理
            </Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreate(null)}
          >
            新建组织
          </Button>
        }
      >
        <Tree
          showLine
          blockNode
          loadData={false}
          treeData={treeDataWithActions(treeData)}
          loading={loading}
          defaultExpandAll
        />
      </Card>

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="组织编码"
            name="code"
            rules={[
              { required: true, message: '请输入组织编码' },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/,
                message: '编码以字母开头，只允许字母、数字、下划线、短横线',
              },
            ]}
            tooltip="创建后不可修改"
          >
            <Input
              placeholder="请输入组织编码"
              disabled={!!editingOrg}
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            label="组织名称"
            name="name"
            rules={[{ required: true, message: '请输入组织名称' }]}
          >
            <Input placeholder="请输入组织名称" maxLength={100} />
          </Form.Item>

          <Form.Item
            label="排序"
            name="sort"
            rules={[{ type: 'number' }]}
            tooltip="数值越小排序越靠前"
          >
            <InputNumber min={0} max={9999} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
