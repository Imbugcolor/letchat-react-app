import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GLOBALTYPES } from "../../../redux/types/global.type";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import moment from 'moment';
import LeftsideSkeletonLoading from "../../skeleton/leftside.skeleton";

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

  if (conversationsData.length < 1) return <LeftsideSkeletonLoading /> 
  return (
    <div className="flex flex-col w-2/5 border-r overflow-y-auto">
      {/* <!-- search compt --> */}
      <div className="border-b py-4 px-2 flex">
        <input
          type="text"
          placeholder="Search"
          className="py-2 px-2 border border-gray-200 rounded-3xl w-full mr-3.5"
        />
        <button onClick={handleOpenAddChatModal} className='add_chat flex justify-center items-center'><LuPlus /></button>
      </div>
      {/* <!-- end search compt --> */}

      {/* <!-- user list --> */}
      {conversationsData.map((cv) => (
        <div
          className={`flex flex-row py-4 px-2 justify-center items-center border-b ${
            // eslint-disable-next-line eqeqeq
            id == cv.id && "active-box-chat"
          } cursor-pointer`}
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
          <div className="w-full flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">
                <p className="text-base leading-7">{cv.name ? cv.name : cv.createdBy.username + " Group"}</p>
                <p className={`text-sm ${cv.isRead === false ? 'font-semibold' : 'font-normal'}`} style={{ color: '#9f9f9f' }}>{cv.lastMessage && moment(cv.lastMessage.createdAt).calendar() }</p>
              </div>
              <div className="flex items-center">
                <span className={`text-gray-500 ${cv.isRead === false && 'font-semibold'} text-sm`}>
                  {
                    cv.lastMessage && cv.lastMessage.senderId && cv.lastMessage.senderId.id === auth.user.id ? 'You: ' : !cv.lastMessage ? '' : cv.lastMessage.senderId.fullname + ': '
                  }
                  {
                    cv.lastMessage && cv.lastMessage.text?.length > 25
                    ? cv.lastMessage.text?.slice(0, 25) + '...'
                    : cv.lastMessage?.message_type === 'text'
                    ? cv.lastMessage.text
                    : ''
                  }
                </span>
                {
                cv.lastMessage && cv.lastMessage.message_type === "photos" && (
                  <span className="text-gray-500">
                    <MdOutlineInsertPhoto /> 
                  </span>
                )}
              </div>
            </div>
            {
              cv.numUnReads > 0 && 
              <span className="unread_count__num">{cv.numUnReads}</span>
            }
          </div>
        </div>
      ))}

      {/* <!-- end user list --> */}
    </div>
  );
};

export default ChatList;
