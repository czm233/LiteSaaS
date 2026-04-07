import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  Tree,
  Tag,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  setRolePermissions,
} from '../../api/role';
import { getPermissions } from '../../api/permission';

/**
 * 将后端权限树数据转换为 Ant Design Tree 需要的格式
 */
function convertToTreeData(list) {
  return list.map((item) => ({
    key: item.id,
    title: (
      <span>
        {item.name}
        <Tag
          color={
            item.type === 'menu'
              ? 'blue'
              : item.type === 'button'
                ? 'green'
                : 'orange'
          }
          style={{ marginLeft: 8 }}
        >
          {item.code}
        </Tag>
      </span>
    ),
    children: item.children ? convertToTreeData(item.children) : [],
  }));
}

/**
 * 从树形结构中提取所有叶子节点和半选节点的 key
 * 递归收集所有 key（包括已选中的和因子节点选中而半选的）
 */
function collectAllKeys(treeData) {
  const keys = [];
  for (const item of treeData) {
    keys.push(item.key);
    if (item.children) {
      keys.push(...collectAllKeys(item.children));
    }
  }
  return keys;
}

export default function Roles() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 列表状态
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({});

  // 新建/编辑弹窗状态
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 权限分配弹窗状态
  const [permModalVisible, setPermModalVisible] = useState(false);
  const [permRole, setPermRole] = useState(null);
  const [permTreeData, setPermTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [permLoading, setPermLoading] = useState(false);
  const [permSaving, setPermSaving] = useState(false);

  /**
   * 加载角色列表
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      };
      const res = await getRoles(params);
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    const clean = {};
    if (values.name) clean.name = values.name;
    if (values.code) clean.code = values.code;
    setFilters(clean);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  /**
   * 重置搜索
   */
  const handleReset = () => {
    searchForm.resetFields();
    setFilters({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  /**
   * 打开新建弹窗
   */
  const handleCreate = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  /**
   * 打开编辑弹窗
   */
  const handleEdit = (record) => {
    setEditingRole(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      description: record.description || '',
    });
    setModalVisible(true);
  };

  /**
   * 提交新建/编辑表单
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      if (editingRole) {
        await updateRole(editingRole.id, values);
        message.success('更新成功');
      } else {
        await createRole(values);
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchData();
    } catch (err) {
      if (err.errorFields) return;
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * 删除角色
   */
  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      message.success('删除成功');
      fetchData();
    } catch {
      // 错误已在拦截器中处理
    }
  };

  /**
   * 打开权限分配弹窗
   */
  const handleOpenPermissions = async (record) => {
    setPermRole(record);
    setPermModalVisible(true);
    setPermLoading(true);
    setCheckedKeys([]);

    try {
      // 并行获取权限树和角色当前权限
      const [permRes, detailRes] = await Promise.all([
        getPermissions(),
        getRole(record.id),
      ]);

      setPermTreeData(permRes.data || []);

      // 提取已分配的 permissionId
      const permIds = (detailRes.data.permissions || []).map(
        (rp) => rp.permissionId,
      );
      setCheckedKeys(permIds);
    } catch {
      // 错误已在拦截器中处理
    } finally {
      setPermLoading(false);
    }
  };

  /**
   * 保存权限分配
   */
  const handleSavePermissions = async () => {
    if (!permRole) return;
    setPermSaving(true);
    try {
      await setRolePermissions(permRole.id, checkedKeys);
      message.success('权限分配成功');
      setPermModalVisible(false);
      fetchData();
    } catch {
      // 错误已在拦截器中处理
    } finally {
      setPermSaving(false);
    }
  };

  /**
   * 表格列定义
   */
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '权限数',
      dataIndex: ['_count', 'permissions'],
      key: 'permCount',
      width: 100,
      render: (count) => count || 0,
    },
    {
      title: '用户数',
      dataIndex: ['_count', 'userOrgRoles'],
      key: 'userCount',
      width: 100,
      render: (count) => count || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (val) => new Date(val).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<SafetyOutlined />}
            onClick={() => handleOpenPermissions(record)}
          >
            分配权限
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除角色「${record.name}」吗？`}
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 搜索栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="name" label="角色名称">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item name="code" label="角色编码">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 表格 */}
      <Card
        title="角色列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建角色
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (page, pageSize) =>
              setPagination({ current: page, pageSize }),
          }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新建角色'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={submitLoading}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[
              { required: true, message: '请输入角色编码' },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                message: '编码须以字母开头，仅允许字母、数字和下划线',
              },
            ]}
          >
            <Input
              placeholder="请输入角色编码"
              maxLength={30}
              disabled={!!editingRole}
            />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea
              placeholder="请输入角色描述"
              maxLength={200}
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限分配弹窗 */}
      <Modal
        title={`分配权限 - ${permRole?.name || ''}`}
        open={permModalVisible}
        onOk={handleSavePermissions}
        onCancel={() => setPermModalVisible(false)}
        confirmLoading={permSaving}
        width={560}
        destroyOnClose
      >
        {permLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>
        ) : (
          <Tree
            checkable
            checkStrictly={false}
            defaultExpandAll
            checkedKeys={checkedKeys}
            onCheck={(keys) => {
              // Ant Design Tree 在 checkStrictly=false 时，onCheck 可能返回对象
              if (typeof keys === 'object' && !Array.isArray(keys)) {
                setCheckedKeys(keys.checked || []);
              } else {
                setCheckedKeys(keys);
              }
            }}
            treeData={convertToTreeData(permTreeData)}
            style={{ maxHeight: 400, overflowY: 'auto' }}
          />
        )}
      </Modal>
    </div>
  );
}
