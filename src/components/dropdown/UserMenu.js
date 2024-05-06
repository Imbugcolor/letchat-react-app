import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux/actions/auth.action";
import { Link } from "react-router-dom";

const UserMenu = () => {
  const auth = useSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  return (
    <div className="user-menu h-12 w-12 rounded-full text-white font-semibold flex items-center justify-center hs-dropdown relative" onClick={toggleMenu}>
        <img src={auth.user.avatar} alt='' className="rounded-full object-cover"/>
      {
        menuOpen &&
        <div
          className="user-dropdown-menu active hs-dropdown-menu min-w-60 bg-white shadow-md rounded-lg p-2 py-2.5 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
          aria-labelledby="hs-dropdown-custom-icon-trigger"
          id='dropdown_menu_options'
          onMouseLeave={() => setMenuOpen(false)}
        >
          <Link to={`/profile/${auth.user.id}`}
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
          >
            Your profile
          </Link>
          <span
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
            onClick={() => dispatch(signOut({ auth }))}
          >
            Sign out
          </span>
        </div>
      }
    </div>
  );
};

export default UserMenu;
