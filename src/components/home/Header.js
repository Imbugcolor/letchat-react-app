import React from "react";
import logo from "../../images/logo.png"
import UserMenu from "../dropdown/UserMenu";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const Header = () => {

  return (
    <div className="header_chat_container px-5 py-5 flex justify-between items-center bg-white border-b">
      <div className="logo_brand cursor-pointer">
        <Link to='/' className="flex font-semibold text-2xl items-center">
          <img src={logo} alt=""/>
          <h4>LetChat</h4>
        </Link>
      </div>
      <SearchBar />
      <UserMenu />
    </div>
  );
};

export default Header;
