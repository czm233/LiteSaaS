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
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../../api/tenant';
import useUserStore from '../../stores/userStore';

const STATUS_MAP = {
  1: { label: '启用', color: 'green' },
  0: { label: '禁用', color: 'red' },
};

export default function Tenants() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const user = useUserStore((s) => s.user);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 分页与筛选参数
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({});

  // 判断是否为系统管理员
  const isAdmin = user?.level === 1;

  // 加载列表
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      };
      const res = await getTenants(params);
      setData(res.data.list);
      setTotal(res.data.total);
    } catch (err) {
      // 错误已在拦截器中提示
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 搜索
  const handleSearch = (values) => {
    const clean = {};
    if (values.name) clean.name = values.name;
    if (values.code) clean.code = values.code;
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

  // 打开新建弹窗
  const handleCreate = () => {
    setEditingTenant(null);
    form.resetFields();
    form.setFieldsValue({ status: 1 });
    setModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record) => {
    setEditingTenant(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      status: record.status,
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      if (editingTenant) {
        await updateTenant(editingTenant.id, values);
        message.success('更新成功');
      } else {
        await createTenant(values);
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchData();
    } catch (err) {
      if (err.errorFields) return; // 表单校验错误，不提示
      // 错误已在拦截器中提示
    } finally {
      setSubmitLoading(false);
    }
  };

  // 删除租户
  const handleDelete = async (id) => {
    try {
      await deleteTenant(id);
      message.success('删除成功');
      fetchData();
    } catch (err) {
      // 错误已在拦截器中提示
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '租户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '租户编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const info = STATUS_MAP[status];
        return info ? <Tag color={info.color}>{info.label}</Tag> : status;
      },
    },
    {
      title: '用户数',
      dataIndex: ['_count', 'users'],
      key: 'userCount',
      width: 100,
    },
    {
      title: '组织数',
      dataIndex: ['_count', 'orgs'],
      key: 'orgCount',
      width: 100,
    },
    {
      title: '角色数',
      dataIndex: ['_count', 'roles'],
      key: 'roleCount',
      width: 100,
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
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={!isAdmin}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除租户「${record.name}」吗？`}
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
            disabled={!isAdmin}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={!isAdmin}
            >
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
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="name" label="租户名称">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item name="code" label="租户编码">
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
        title="租户列表"
        extra={
          isAdmin ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建租户
            </Button>
          ) : null
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
        title={editingTenant ? '编辑租户' : '新建租户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={submitLoading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="租户名称"
            rules={[{ required: true, message: '请输入租户名称' }]}
          >
            <Input placeholder="请输入租户名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="code"
            label="租户编码"
            rules={[
              { required: true, message: '请输入租户编码' },
              { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '编码须以字母开头，仅允许字母、数字和下划线' },
            ]}
          >
            <Input
              placeholder="请输入租户编码"
              maxLength={30}
              disabled={!!editingTenant}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
