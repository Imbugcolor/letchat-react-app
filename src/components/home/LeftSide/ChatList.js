import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GLOBALTYPES } from "../../../redux/types/global.type";
import { MdOutlineInsertPhoto } from "react-icons/md";

const ChatList = () => {
  const auth = useSelector((state) => state.auth);
  const message = useSelector((state) => state.message);
  const [conversationsData, setConversationsData] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { id } = useParams();

  const handleClickConversation = (cv) => {
    return navigate(`/message/${cv.id}`);
  };

  const handleOpenAddChatModal = () => {
    dispatch({ type: GLOBALTYPES.MODAL, payload: { addChat: true } });
  };

  useEffect(() => {
    setConversationsData(message.conversations);
  }, [message.conversations]);

  return (
    <div className="flex flex-col w-2/5 border-r overflow-y-auto">
      {/* <!-- search compt --> */}
      <div className="border-b py-4 px-2">
        <input
          type="text"
          placeholder="search chatting"
          className="py-2 px-2 border border-gray-200 rounded-2xl w-full"
        />
        <button onClick={handleOpenAddChatModal}>Add Chat</button>
      </div>
      {/* <!-- end search compt --> */}

      {/* <!-- user list --> */}
      {conversationsData.map((cv) => (
        <div
          className={`flex flex-row py-4 px-2 justify-center items-center border-b ${
            id == cv.id && "active-box-chat"
          }`}
          key={cv.id}
          onClick={() => handleClickConversation(cv)}
        >
          <div className="w-1/4">
            <img
              src={cv.thumbnail}
              className="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div className="w-full">
            <div className="text-lg font-semibold">
              {cv.name ? cv.name : cv.createdBy.username + " Group"}
            </div>
            <span className={`text-gray-500 ${cv.isRead === false && 'font-semibold'}`}>
              {
                cv.lastMessage && cv.lastMessage.senderId && cv.lastMessage.senderId.id === auth.user.id ? 'You: ' : !cv.lastMessage ? '' : cv.lastMessage.senderId.fullname + ': '
              }
              {cv.lastMessage && cv.lastMessage.text?.length > 25
                ? cv.lastMessage.text?.slice(0, 25) + '...'
                : !cv.lastMessage?.text
                ? ""
                : cv.lastMessage.text}
            </span>
            {cv.lastMessage && cv.lastMessage.message_type === "photos" && (
              <span>
                <MdOutlineInsertPhoto /> send photos
              </span>
            )}
          </div>
        </div>
      ))}

      {/* <!-- end user list --> */}
    </div>
  );
};

export default ChatList;
