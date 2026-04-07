import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Card,
  Tag,
  message,
  Switch,
  Tooltip,
  TreeSelect,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import {
  getUsers,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  getUserRoles,
} from '../../api/user';
import { getOrganizationTree } from '../../api/organization';

const STATUS_MAP = {
  1: { label: '启用', color: 'green' },
  0: { label: '禁用', color: 'red' },
};

const DATA_SCOPE_OPTIONS = [
  { value: 'self', label: '仅本人' },
  { value: 'org_and_below', label: '本组织及下级' },
  { value: 'all', label: '全部' },
];

export default function Users() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 分页与筛选
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({});

  // 组织树和角色列表（弹窗用）
  const [orgTree, setOrgTree] = useState([]);
  const [roleList, setRoleList] = useState([]);

  // 组织角色关联列表
  const [orgRoles, setOrgRoles] = useState([]);

  // 加载列表
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      };
      const res = await getUsers(params);
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      // 错误已在拦截器中提示
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 加载组织树和角色列表
  const fetchOptions = useCallback(async () => {
    try {
      const [orgRes, roleRes] = await Promise.all([
        getOrganizationTree(),
        getUserRoles(),
      ]);
      setOrgTree(orgRes.data || []);
      setRoleList(roleRes.data || []);
    } catch {
      // 错误已在拦截器中提示
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // 搜索
  const handleSearch = (values) => {
    const clean = {};
    if (values.username) clean.username = values.username;
    if (values.name) clean.name = values.name;
    if (values.status !== undefined && values.status !== null && values.status !== '')
      clean.status = values.status;
    setFilters(clean);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setFilters({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // 将平铺的组织列表转为树形
  function buildOrgTree(list, parentId = null) {
    return list
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        value: item.id,
        title: item.name,
        children: item.children ? buildOrgTree(item.children) : [],
      }));
  }

  // 打开新建弹窗
  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ status: 1, level: 5 });
    setOrgRoles([]);
    setModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = async (record) => {
    setEditingUser(record);
    setOrgRoles(
      record.userOrgRoles.map((uor) => ({
        organizationId: uor.organizationId,
        roleId: uor.roleId,
        dataScope: uor.dataScope || 'self',
      })),
    );
    form.setFieldsValue({
      username: record.username,
      name: record.name,
      email: record.email || '',
      phone: record.phone || '',
      status: record.status,
      level: record.level,
    });
    setModalVisible(true);
  };

  // 添加组织角色行
  const addOrgRole = () => {
    setOrgRoles((prev) => [...prev, { organizationId: undefined, roleId: undefined, dataScope: 'self' }]);
  };

  // 删除组织角色行
  const removeOrgRole = (index) => {
    setOrgRoles((prev) => prev.filter((_, i) => i !== index));
  };

  // 更新组织角色行
  const updateOrgRole = (index, field, value) => {
    setOrgRoles((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      // 校验组织角色
      for (const or of orgRoles) {
        if (!or.organizationId || !or.roleId) {
          message.warning('请完整填写组织角色关联信息');
          setSubmitLoading(false);
          return;
        }
      }
      // 检查组织角色是否有重复
      const orgKeys = orgRoles.map((or) => or.organizationId);
      if (new Set(orgKeys).size !== orgKeys.length) {
        message.warning('同一用户在同一组织下只能有一个角色');
        setSubmitLoading(false);
        return;
      }

      const payload = {
        ...values,
        orgRoles: orgRoles.length > 0 ? orgRoles : [],
      };

      if (editingUser) {
        await updateUser(editingUser.id, payload);
        message.success('更新成功');
      } else {
        await createUser(payload);
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchData();
    } catch (err) {
      if (err.errorFields) return;
      // 错误已在拦截器中提示
    } finally {
      setSubmitLoading(false);
    }
  };

  // 删除用户
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      message.success('删除成功');
      fetchData();
    } catch {
      // 错误已在拦截器中提示
    }
  };

  // 重置密码
  const handleResetPassword = async (id) => {
    try {
      await resetUserPassword(id);
      message.success('密码已重置为 123456');
    } catch {
      // 错误已在拦截器中提示
    }
  };

  // 切换用户状态
  const handleToggleStatus = async (record) => {
    const newStatus = record.status === 1 ? 0 : 1;
    try {
      await updateUser(record.id, { status: newStatus });
      message.success(newStatus === 1 ? '已启用' : '已禁用');
      fetchData();
    } catch {
      // 错误已在拦截器中提示
    }
  };

  // 查看用户详情
  const handleViewDetail = async (id) => {
    setDetailLoading(true);
    setDetailVisible(true);
    try {
      const res = await getUserDetail(id);
      setDetailData(res.data);
    } catch {
      // 错误已在拦截器中提示
    } finally {
      setDetailLoading(false);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: '组织/角色',
      key: 'orgRoles',
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        const roles = record.userOrgRoles || [];
        if (roles.length === 0) return <span style={{ color: '#999' }}>未分配</span>;
        return (
          <div>
            {roles.map((uor) => (
              <Tag key={uor.id} style={{ marginBottom: 2 }}>
                {uor.organization?.name} / {uor.role?.name}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={() => handleToggleStatus(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          size="small"
        />
      ),
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
      width: 240,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewDetail(record.id)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="重置密码"
            description="确定将该用户密码重置为 123456？"
            onConfirm={() => handleResetPassword(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="重置密码">
              <Button type="link" size="small" icon={<KeyOutlined />} />
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title="确认删除"
            description={`确定要删除用户「${record.name}」吗？`}
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

  const orgTreeData = buildOrgTree(orgTree);

  return (
    <div style={{ padding: 24 }}>
      {/* 搜索栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="username" label="用户名">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item name="name" label="姓名">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="全部" allowClear style={{ width: 120 }}>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
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
        title="用户列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建用户
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={submitLoading}
        destroyOnClose
        width={640}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                message: '用户名以字母开头，只允许字母、数字、下划线',
              },
            ]}
            tooltip="创建后不可修改"
          >
            <Input placeholder="请输入用户名" maxLength={50} disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" maxLength={50} />
          </Form.Item>

          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" maxLength={100} />
          </Form.Item>

          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" maxLength={20} />
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="level" label="用户级别" rules={[{ required: true, message: '请选择用户级别' }]}>
            <Select>
              <Select.Option value={1}>系统管理员</Select.Option>
              <Select.Option value={2}>租户管理员</Select.Option>
              <Select.Option value={3}>部门经理</Select.Option>
              <Select.Option value={5}>普通用户</Select.Option>
            </Select>
          </Form.Item>

          {/* 组织角色关联 */}
          <Form.Item label="组织角色">
            <div style={{ width: '100%' }}>
              {orgRoles.map((item, index) => (
                <div
                  key={index}
                  style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}
                >
                  <TreeSelect
                    placeholder="选择组织"
                    treeData={orgTreeData}
                    value={item.organizationId}
                    onChange={(val) => updateOrgRole(index, 'organizationId', val)}
                    style={{ flex: 1 }}
                    allowClear
                    showSearch
                    treeNodeFilterProp="title"
                  />
                  <Select
                    placeholder="选择角色"
                    value={item.roleId}
                    onChange={(val) => updateOrgRole(index, 'roleId', val)}
                    style={{ width: 140 }}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    options={roleList.map((r) => ({ value: r.id, label: r.name }))}
                  />
                  <Select
                    value={item.dataScope}
                    onChange={(val) => updateOrgRole(index, 'dataScope', val)}
                    style={{ width: 120 }}
                    options={DATA_SCOPE_OPTIONS}
                  />
                  <Button
                    type="link"
                    danger
                    onClick={() => removeOrgRole(index)}
                    style={{ flexShrink: 0 }}
                  >
                    删除
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={addOrgRole} block>
                + 添加组织角色
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 用户详情弹窗 */}
      <Modal
        title="用户详情"
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false);
          setDetailData(null);
        }}
        footer={null}
        width={600}
        loading={detailLoading}
      >
        {detailData && (
          <div>
            <p><strong>用户名：</strong>{detailData.username}</p>
            <p><strong>姓名：</strong>{detailData.name}</p>
            <p><strong>邮箱：</strong>{detailData.email || '-'}</p>
            <p><strong>手机号：</strong>{detailData.phone || '-'}</p>
            <p>
              <strong>状态：</strong>
              <Tag color={STATUS_MAP[detailData.status]?.color}>
                {STATUS_MAP[detailData.status]?.label}
              </Tag>
            </p>
            <p><strong>用户级别：</strong>{detailData.level}</p>
            <p><strong>创建时间：</strong>{new Date(detailData.createdAt).toLocaleString()}</p>
            <p><strong>更新时间：</strong>{new Date(detailData.updatedAt).toLocaleString()}</p>

            <div style={{ marginTop: 16 }}>
              <strong>组织角色：</strong>
              {detailData.orgRoles && detailData.orgRoles.length > 0 ? (
                <Table
                  size="small"
                  dataSource={detailData.orgRoles}
                  rowKey="id"
                  pagination={false}
                  style={{ marginTop: 8 }}
                  columns={[
                    { title: '组织', dataIndex: 'organizationName', key: 'org' },
                    { title: '角色', dataIndex: 'roleName', key: 'role' },
                    {
                      title: '数据范围',
                      dataIndex: 'dataScope',
                      key: 'dataScope',
                      render: (val) => {
                        const opt = DATA_SCOPE_OPTIONS.find((o) => o.value === val);
                        return opt ? opt.label : val;
                      },
                    },
                  ]}
                />
              ) : (
                <span style={{ color: '#999' }}>未分配</span>
              )}
            </div>

            {detailData.permissions && detailData.permissions.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <strong>权限编码：</strong>
                <div style={{ marginTop: 4 }}>
                  {detailData.permissions.map((p) => (
                    <Tag key={p} style={{ marginBottom: 4 }}>
                      {p}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
