import "./layout.css";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-content">
        <Header />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;