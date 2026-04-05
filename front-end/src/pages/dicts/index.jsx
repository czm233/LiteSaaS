import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Select,
  Input,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  message,
  Card,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getDictList,
  getDictTypes,
  createDict,
  updateDict,
  deleteDict,
} from '../../api/dict';

export default function DictPage() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  // 加载字典列表
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDictList({
        page,
        pageSize,
        type: selectedType || undefined,
      });
      setList(res.data.list);
      setTotal(res.data.total);
    } catch {
      // 错误已在拦截器中提示
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, selectedType]);

  // 加载字典类型列表
  const fetchTypes = useCallback(async () => {
    try {
      const res = await getDictTypes();
      setTypes(res.data);
    } catch {
      // 错误已在拦截器中提示
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 搜索类型变化时重置页码
  const handleTypeChange = (value) => {
    setSelectedType(value);
    setPage(1);
  };

  // 打开新建弹窗
  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    if (selectedType) {
      form.setFieldsValue({ type: selectedType });
    }
    setModalOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      type: record.type,
      code: record.code,
      name: record.name,
      value: record.value,
      sort: record.sort,
    });
    setModalOpen(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      if (editingRecord) {
        await updateDict(editingRecord.id, values);
        message.success('更新成功');
      } else {
        await createDict(values);
        message.success('创建成功');
      }

      setModalOpen(false);
      form.resetFields();
      fetchList();
      fetchTypes();
    } catch {
      // 校验失败或接口错误已在拦截器中提示
    } finally {
      setSubmitLoading(false);
    }
  };

  // 删除
  const handleDelete = async (id) => {
    try {
      await deleteDict(id);
      message.success('删除成功');
      fetchList();
      fetchTypes();
    } catch {
      // 错误已在拦截器中提示
    }
  };

  const columns = [
    {
      title: '字典类型',
      dataIndex: 'type',
      width: 150,
    },
    {
      title: '字典编码',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '字典值',
      dataIndex: 'value',
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该字典吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="字典管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建字典
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <span>字典类型：</span>
          <Select
            allowClear
            placeholder="全部类型"
            style={{ width: 200 }}
            value={selectedType || undefined}
            onChange={handleTypeChange}
            options={types.map((t) => ({ label: t, value: t }))}
          />
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </Card>

      <Modal
        title={editingRecord ? '编辑字典' : '新建字典'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        confirmLoading={submitLoading}
        okText="确定"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="字典类型"
            name="type"
            rules={[{ required: true, message: '请输入字典类型' }]}
          >
            <Input placeholder="例如：gender、status" />
          </Form.Item>
          <Form.Item
            label="字典编码"
            name="code"
            rules={[{ required: true, message: '请输入字典编码' }]}
          >
            <Input placeholder="例如：male、female" />
          </Form.Item>
          <Form.Item
            label="字典名称"
            name="name"
            rules={[{ required: true, message: '请输入字典名称' }]}
          >
            <Input placeholder="例如：男、女" />
          </Form.Item>
          <Form.Item label="字典值" name="value">
            <Input placeholder="字典值（可选）" />
          </Form.Item>
          <Form.Item label="排序" name="sort" initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
