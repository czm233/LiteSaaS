import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Dropdown, Avatar, Space, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
} from '@ant-design/icons';
import useUserStore from '../../stores/userStore';

const { Header } = Layout;

export default function HeaderContent({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const { token: themeToken } = theme.useToken();
  const [loggingOut, setLoggingOut] = useState(false);

  const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');

  const dropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心',
      },
      {
        key: 'password',
        icon: <EditOutlined />,
        label: '修改密码',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        danger: true,
      },
    ],
    onClick: async ({ key }) => {
      if (key === 'logout') {
        setLoggingOut(true);
        try {
          await logout();
        } catch {
          // 即使 API 失败也要清除本地状态并跳转
        }
        setLoggingOut(false);
        navigate('/login', { replace: true });
      }
    },
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        background: themeToken.colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 9,
      }}
    >
      {/* 左侧：折叠按钮 */}
      <span
        onClick={onToggle}
        style={{
          fontSize: 18,
          cursor: 'pointer',
          lineHeight: 1,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </span>

      {/* 右侧：租户名称 + 用户下拉 */}
      <Space size={16} align="center">
        <span style={{ color: themeToken.colorTextSecondary, fontSize: 14 }}>
          {currentUser.tenantName || '默认租户'}
        </span>
        <Dropdown menu={dropdownItems} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }} align="center">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: themeToken.colorPrimary }}
            />
            <span style={{ fontSize: 14 }}>
              {currentUser.name || currentUser.username || '用户'}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
