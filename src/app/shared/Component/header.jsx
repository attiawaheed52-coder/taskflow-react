import "./header.css";

function Header() {
  return (
    <header className="header">

      <div>
        <h2>Welcome Back 👋</h2>
      </div>

      <div className="profile">

        <img
          src="https://i.pravatar.cc/40"
          alt=""
        />

        <span>Attia</span>

      </div>

    </header>
  );
}

export default Header;