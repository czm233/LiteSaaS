export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div>
      <h1>首页</h1>
      <p>欢迎, {user.name || user.username}</p>
    </div>
  );
}
