import React, { useEffect, useState } from "react";
import AccordionItem from "../../accordion/AccordionItem";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../../redux/types/global.type";
import { useParams } from "react-router-dom";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { LuPlus } from "react-icons/lu";
import MemberOptions from "../../dropdown/memberOptions";

const DetailConversation = () => {
  const auth = useSelector((state) => state.auth);
  const message = useSelector((state) => state.message);
  const media = useSelector((state) => state.media);
  const status = useSelector((state) => state.status);
  const dispatch = useDispatch();
  const [conversation, setConversation] = useState();
  const [loadMedia, setLoadMedia] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const online = [];
    if (
      conversation &&
      conversation.participants &&
      conversation.participants.length > 0
    ) {
      conversation.participants.forEach((part) => {
        if (status.some((id) => id === part.user.id)) {
          return online.push(part.user);
        }
      });
    }
    setUsersOnline(online);
  }, [id, status, conversation]);

  useEffect(() => {
    if (id && message.conversations.length > 0) {
      const data = message.conversations.find((cv) => cv.id === parseInt(id));
      setConversation(data);
    }
  }, [id, message.conversations]);

  useEffect(() => {
    const mediaData = media.find((md) => md.conversationId === Number(id));
    if (!mediaData) {
      setLoadMedia(true);
    } else {
      const mediaFiles = mediaData.data;
      setLoadMedia(false);
      setMediaData(mediaFiles);
    }
  }, [media, id]);

  if (!conversation) return <></>;
  return (
    <div className="w-2/5 border-l px-5 overflow-y-auto">
      <div className="flex flex-col">
        <div className="font-semibold text-xl py-4">
          {conversation.name || conversation.createdBy.username} Group
        </div>
        <img src={conversation.thumbnail} className="w-40 m-auto" alt="" />
        <div className="py-4 flex items-center">
          <GoDotFill style={{ color: "green" }} /> {usersOnline.length} online
        </div>
      </div>
      <div className="accordion font-medium">
        <AccordionItem
          conversationId={conversation.id}
          title="About Conversation"
          content={
            <>
              <p className="font-normal my-3.5">
                Created at{" "}
                {new Date(conversation.createdAt).toLocaleDateString() +
                  " " +
                  new Date(conversation.createdAt).toLocaleTimeString()}
              </p>
            </>
          }
        />
        <AccordionItem
          conversationId={conversation.id}
          title="Members"
          content={
            <>
              {conversation.participants.map((part) => (
                <div className="flex items-center my-3.5" key={part.id}>
                  <div className="mr-3.5 relative">
                    <img
                      className="w-10 rounded-full"
                      src={part.user.avatar}
                      alt=""
                    />
                    <div className="absolute -bottom-1 right-0 bg-white rounded-full">
                      {usersOnline.some((usr) => usr.id === part.user.id) && (
                        <GoDotFill style={{ color: "green" }} />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-4/5">
                    <div>
                      <p>{part.user.fullname}</p>
                      <p
                        className="font-normal text-sm"
                        style={{ color: "#9f9f9f" }}
                      >
                        {part.user.id === conversation.createdBy.id
                          ? "Group creator"
                          : "Member"}
                      </p>
                    </div>
                    {part.user.id !== auth.user.id && (
                      <div className="">
                        <MemberOptions
                          user={part.user}
                          conversation={conversation}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {conversation.createdBy.id === auth.user.id && (
                <div
                  className="add-member-button my-4 flex items-center cursor-pointer"
                  onClick={() =>
                    dispatch({
                      type: GLOBALTYPES.MODAL,
                      payload: { addMember: conversation },
                    })
                  }
                >
                  <LuPlus className="w-10 h-10 mr-3.5 rounded-full p-2" /> Add
                  Member
                </div>
              )}
            </>
          }
        />
        {conversation.createdBy.id === auth.user.id && (
          <AccordionItem
            conversationId={conversation.id}
            title="Customize Conversation"
            content={
              <>
                <div
                  className="option_collapse_expand flex items-center my-3.5 cursor-pointer"
                  onClick={() =>
                    dispatch({
                      type: GLOBALTYPES.MODAL,
                      payload: { editChat: conversation },
                    })
                  }
                >
                  <MdOutlineDriveFileRenameOutline className="icon_option" />
                  <p>Change Name</p>
                </div>
                <div
                  className="option_collapse_expand flex items-center my-3.5 cursor-pointer"
                  onClick={() =>
                    dispatch({
                      type: GLOBALTYPES.MODAL,
                      payload: { editThumbnail: conversation },
                    })
                  }
                >
                  <MdOutlineInsertPhoto className="icon_option" />
                  <p>Change Photo</p>
                </div>
                <div className="option_collapse_expand flex items-center my-3.5 cursor-pointer">
                  <IoColorPaletteOutline className="icon_option" />
                  <p>Change Color</p>
                </div>
              </>
            }
          />
        )}
        <AccordionItem
          conversationId={conversation.id}
          title="Media files"
          content={
            loadMedia ? (
              <div className="font-normal">
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </>
              </div>
            ) : (
              <div className="flex font-normal italic">
                {mediaData.length > 0
                  ? mediaData.map((md) => (
                      <div key={md.id} className="w-12">
                        <img src={md.url} alt="" />
                      </div>
                    ))
                  : "No media files yet"}
              </div>
            )
          }
        />
      </div>
    </div>
  );
};

export default DetailConversation;
