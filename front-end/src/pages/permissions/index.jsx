import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Tree,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Popconfirm,
  Tag,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from '../../api/permission';

const PERMISSION_TYPES = [
  { value: 'menu', label: '菜单', color: 'blue' },
  { value: 'button', label: '按钮', color: 'green' },
  { value: 'data', label: '数据', color: 'orange' },
];

/**
 * 将树形数据转换为 Ant Design Tree 组件需要的格式
 */
function convertToTreeData(list) {
  return list.map((item) => ({
    key: item.id,
    title: (
      <span>
        {item.name}
        <Tag
          color={
            PERMISSION_TYPES.find((t) => t.value === item.type)?.color ||
            'default'
          }
          style={{ marginLeft: 8 }}
        >
          {item.code}
        </Tag>
      </span>
    ),
    children: item.children ? convertToTreeData(item.children) : [],
    ...item,
  }));
}

/**
 * 递归从树中查找节点
 */
function findNodeInTree(list, id) {
  for (const item of list) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findNodeInTree(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

export default function Permissions() {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  /**
   * 加载权限树
   */
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPermissions();
      setTreeData(res.data || []);
    } catch {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  /**
   * 打开新建弹窗（可在选中节点下创建子权限）
   */
  const handleAdd = () => {
    setEditingPermission(null);
    form.resetFields();
    form.setFieldsValue({
      parentId: selectedNode?.id || null,
      sort: 0,
      type: 'menu',
    });
    setModalOpen(true);
  };

  /**
   * 打开编辑弹窗
   */
  const handleEdit = () => {
    if (!selectedNode) {
      message.warning('请先选择要编辑的权限');
      return;
    }
    setEditingPermission(selectedNode);
    form.setFieldsValue({
      type: selectedNode.type,
      code: selectedNode.code,
      name: selectedNode.name,
      path: selectedNode.path || '',
      sort: selectedNode.sort,
      parentId: selectedNode.parentId || null,
    });
    setModalOpen(true);
  };

  /**
   * 提交表单（新建或编辑）
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editingPermission) {
        // 编辑：移除 parentId 如果没有变化
        const updateData = { ...values };
        await updatePermission(editingPermission.id, updateData);
        message.success('更新成功');
      } else {
        // 新建
        await createPermission(values);
        message.success('创建成功');
      }

      setModalOpen(false);
      fetchPermissions();
    } catch {
      // 表单验证失败或接口错误
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 删除权限
   */
  const handleDelete = async () => {
    if (!selectedNode) {
      message.warning('请先选择要删除的权限');
      return;
    }
    try {
      await deletePermission(selectedNode.id);
      message.success('删除成功');
      setSelectedNode(null);
      fetchPermissions();
    } catch {
      // 错误已在拦截器中处理
    }
  };

  /**
   * 树节点选中事件
   */
  const handleTreeSelect = (selectedKeys, { node }) => {
    if (selectedKeys.length > 0) {
      const permission = findNodeInTree(treeData, node.key);
      setSelectedNode(permission);
    } else {
      setSelectedNode(null);
    }
  };

  /**
   * 获取可用的父权限列表（用于选择，排除自身及后代）
   */
  const getParentOptions = () => {
    function flatten(list) {
      const result = [];
      for (const item of list) {
        result.push({ id: item.id, name: item.name, code: item.code });
        if (item.children) {
          result.push(...flatten(item.children));
        }
      }
      return result;
    }

    const all = flatten(treeData);

    // 编辑模式下，排除自身
    if (editingPermission) {
      return all.filter((item) => item.id !== editingPermission.id);
    }

    return all;
  };

  return (
    <Card
      title="权限管理"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建权限
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={handleEdit}
            disabled={!selectedNode}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除权限「${selectedNode?.name}」吗？`}
            onConfirm={handleDelete}
            okText="确定"
            cancelText="取消"
            disabled={!selectedNode}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={!selectedNode}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      {selectedNode && (
        <div
          style={{
            marginBottom: 16,
            padding: '8px 12px',
            background: '#f6f8fa',
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          <span style={{ color: '#999', marginRight: 8 }}>当前选中：</span>
          <strong>{selectedNode.name}</strong>
          <Tag
            color={
              PERMISSION_TYPES.find((t) => t.value === selectedNode.type)
                ?.color || 'default'
            }
            style={{ marginLeft: 8 }}
          >
            {selectedNode.code}
          </Tag>
          {selectedNode.path && (
            <span style={{ color: '#999', marginLeft: 8 }}>
              路径: {selectedNode.path}
            </span>
          )}
        </div>
      )}

      <Tree
        showLine
        blockNode
        treeData={convertToTreeData(treeData)}
        onSelect={handleTreeSelect}
        loading={loading}
        defaultExpandAll
        style={{ fontSize: 14 }}
      />

      <Modal
        title={editingPermission ? '编辑权限' : '新建权限'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
        width={520}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="parentId"
            label="父级权限"
          >
            <Select
              allowClear
              placeholder="无（顶级权限）"
              showSearch
              optionFilterProp="label"
              options={getParentOptions().map((item) => ({
                value: item.id,
                label: `${item.name}（${item.code}）`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="权限类型"
            rules={[{ required: true, message: '请选择权限类型' }]}
          >
            <Select
              placeholder="请选择权限类型"
              options={PERMISSION_TYPES.map((t) => ({
                value: t.value,
                label: (
                  <span>
                    <Tag color={t.color}>{t.label}</Tag>
                  </span>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item
            name="code"
            label="权限编码"
            rules={[
              { required: true, message: '请输入权限编码' },
              {
                pattern: /^[a-z][a-z0-9]*:[a-z][a-z0-9]*$/,
                message: '编码格式: module:action，如 user:view',
              },
            ]}
          >
            <Input placeholder="例如: user:view、user:create、data:all" />
          </Form.Item>

          <Form.Item
            name="name"
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="例如: 用户管理查看" />
          </Form.Item>

          <Form.Item name="path" label="路由路径">
            <Input placeholder="菜单权限填写前端路由路径，如 /users" />
          </Form.Item>

          <Form.Item name="sort" label="排序">
            <InputNumber min={0} max={9999} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
