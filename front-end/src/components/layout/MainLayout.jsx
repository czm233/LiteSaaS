import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Sidebar, { menuLabelMap } from './Sidebar';
import HeaderContent from './HeaderContent';

const { Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  /**
   * 根据当前路径生成面包屑
   */
  const breadcrumbItems = useMemo(() => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);
    const items = [
      {
        title: (
          <a href="/">
            <HomeOutlined />
          </a>
        ),
      },
    ];
    let currentPath = '';
    pathSnippets.forEach((snippet) => {
      currentPath += `/${snippet}`;
      const label = menuLabelMap[currentPath];
      if (label) {
        items.push({ title: label });
      }
    });
    return items;
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 220,
          transition: 'margin-left 0.2s',
        }}
      >
        <HeaderContent
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <Content
          style={{
            margin: 24,
            minHeight: 280,
          }}
        >
          <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />
          <div
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 8,
              minHeight: 'calc(100vh - 64px - 48px - 48px)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
