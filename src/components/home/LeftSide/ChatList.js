import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GLOBALTYPES } from "../../../redux/types/global.type";

const ChatList = () => {
  const auth = useSelector((state) => state.auth);
  const message = useSelector((state) => state.message);

  const dispatch = useDispatch()

  const navigate = useNavigate()


  const handleClickConversation = (cv) => {
    return navigate(`/message/${cv.id}`)
  }

  const handleOpenAddChatModal = () => {
    dispatch({type: GLOBALTYPES.MODAL, payload: { addChat: true }})
  }

  return (
    <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
      {/* <!-- search compt --> */}
      <div className="border-b-2 py-4 px-2">
        <input
          type="text"
          placeholder="search chatting"
          className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
        />
        <button onClick={handleOpenAddChatModal}>Add Chat</button>
      </div>
      {/* <!-- end search compt --> */}

      {/* <!-- user list --> */}
      {message.conversations.map((cv) => (
        <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2" key={cv.id} onClick={() => handleClickConversation(cv)}>
          <div className="w-1/4">
            <img
              src="https://source.unsplash.com/_7LbC5J-jw4/600x600"
              className="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div className="w-full">
            <div className="text-lg font-semibold">{cv.participants.map(_user => `${_user.user.username}, `)}</div>
            <span className="text-gray-500">Pick me at 9:00 Am</span>
          </div>
        </div>
      ))}

      {/* <!-- end user list --> */}
    </div>
  );
};

export default ChatList;
