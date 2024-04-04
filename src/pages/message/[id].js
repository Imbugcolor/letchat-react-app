import React from "react";
import Header from "../../components/home/Header";
import Body from "../../components/home/Body";

const Conversations = () => {
  return (
    <div>
      <div className="container max-w-full mx-auto shadow-lg rounded-lg">
        {/* <!-- headaer --> */}
        <Header />
        {/* <!-- end header --> */}
        {/* <!-- Chatting --> */}
        <Body />
      </div>
    </div>
  );
};

export default Conversations;
