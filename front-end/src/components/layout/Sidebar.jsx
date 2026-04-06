import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  BankOutlined,
  ApartmentOutlined,
  UserOutlined,
  SafetyOutlined,
  KeyOutlined,
  BookOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

/**
 * 静态菜单数据，后续接入权限 API 后替换为动态数据
 */
const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: '/tenants',
    icon: <BankOutlined />,
    label: '租户管理',
  },
  {
    key: '/organizations',
    icon: <ApartmentOutlined />,
    label: '组织管理',
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: '用户管理',
  },
  {
    key: '/roles',
    icon: <SafetyOutlined />,
    label: '角色管理',
  },
  {
    key: '/permissions',
    icon: <KeyOutlined />,
    label: '权限管理',
  },
  {
    key: '/dicts',
    icon: <BookOutlined />,
    label: '字典管理',
  },
];

/**
 * 面包屑名称映射
 */
export const menuLabelMap = {};
menuItems.forEach((item) => {
  menuLabelMap[item.key] = item.label;
});

export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKeys = useMemo(() => [location.pathname], [location.pathname]);

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={220}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: collapsed ? 16 : 20,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            transition: 'font-size 0.2s',
          }}
        >
          {collapsed ? 'L' : 'LiteSaaS'}
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}
