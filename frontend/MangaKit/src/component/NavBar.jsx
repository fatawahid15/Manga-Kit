export default function NavBar() {

  const token = localStorage.getItem('access_token')

  return (
    <>
    {token ? (
      <>
      <div className="navbar bg-orange-500">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
          ></div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl text-white">Home</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <button className="btn btn-ghost text-xl text-white font-medium">Your Profile</button>
          </li>
          <li>
          <button className="btn btn-ghost text-xl text-white font-medium">Ask Ai</button>
          </li>
          <li>
            <button className="btn btn-ghost text-xl text-white font-medium">Login</button>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
      <button className="btn btn-ghost text-xl text-white font-medium">Logout</button>
      </div>
    </div>
    <br />
    </>
    ) :
    <>
    <div className="navbar bg-orange-500">
    <div className="navbar-start">
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost lg:hidden"
        ></div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
      <a className="btn btn-ghost text-xl text-white">Home</a>
    </div>
    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal px-1">
        <li>
        <button className="btn btn-ghost text-xl text-white font-medium">Ask Ai</button>
        </li>
      </ul>
    </div>
    <div className="navbar-end">
    <button className="btn btn-ghost text-xl text-white font-medium">Login</button>
    </div>
  </div>
  <br />
  </>
    }
      </>
  );
}
