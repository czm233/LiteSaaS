import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined } from '@ant-design/icons';
import useUserStore from '../../stores/userStore';
import { getTenants } from '../../api/auth';

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    getTenants().then((res) => {
      setTenants(res.data);
      // 只有一个租户时自动选中
      if (res.data.length === 1) {
        form.setFieldsValue({ tenantCode: res.data[0].code });
      }
    });
  }, [form]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await login(values.tenantCode, values.username, values.password);
      message.success('登录成功');
      navigate('/');
    } catch (err) {
      // 错误已在拦截器中提示
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card title="LiteSaaS 登录" style={{ width: 400 }}>
        <Form form={form} onFinish={handleLogin} size="large">
          <Form.Item
            name="tenantCode"
            rules={[{ required: true, message: '请选择租户' }]}
          >
            <Select placeholder="请选择租户" prefix={<BankOutlined />}>
              {tenants.map((t) => (
                <Select.Option key={t.code} value={t.code}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
