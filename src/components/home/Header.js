import React from "react";
import logo from "../../images/logo.png"
import UserMenu from "../dropdown/UserMenu";

const Header = () => {
  return (
    <div className="header_chat_container px-5 py-5 flex justify-between items-center bg-white border-b">
      <div className="logo_brand flex items-center font-semibold text-2xl">
        <img src={logo} alt=""/>
        <h4>LetChat</h4>
      </div>
      <div className="w-1/2">
        <input
          type="text"
          name=""
          id=""
          placeholder="search IRL"
          className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
        />
      </div>
      <UserMenu />
    </div>
  );
};

export default Header;
