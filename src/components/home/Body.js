import React from "react";
import ChatList from "./LeftSide/ChatList";
import Message from "./Center/Message";
import DetailConversation from "./RightSide/DetailConversation";

const Body = () => {
  return (
    <div className="main_chat__container flex flex-row justify-between bg-white">
      {/* <!-- chat list --> */}
      <ChatList />

      {/* Message */}
      <Message />

      {/* <!-- end message --> */}
      <DetailConversation />
    </div>
  );
};

export default Body;
