import React, { useEffect, useState } from "react";
import AccordionItem from "../../accordion/AccordionItem";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../../redux/types/global.type";
import { useParams } from "react-router-dom";
import { MdOutlineInsertPhoto } from "react-icons/md";

const DetailConversation = () => {
  const message = useSelector(state => state.message)
  const dispatch = useDispatch()
  const [conversation, setConversation] = useState()

  const { id } = useParams();

  useEffect(() => {
    if(id && message.conversations.length > 0) {
      const data = message.conversations.find(cv => cv.id === parseInt(id))
      setConversation(data);
    }
  },[id, message.conversations])

  if (!conversation) return <></>
  return (
    <div className="w-2/5 border-l px-5">
      <div className="flex flex-col">
        <div className="font-semibold text-xl py-4">{conversation.name || conversation.createdBy.username} Group</div>
        <img
          src={conversation.thumbnail}
          className="h-64"
          alt=""
        />
        <div className="font-semibold py-4">Active</div>
      </div>
      <div className="accordion font-medium">
        <AccordionItem
          title="About Conversation"
          content={
            <>
              <p className="font-normal my-3.5">
                Created at {new Date(conversation.createdAt).toLocaleDateString() + " " + new Date(conversation.createdAt).toLocaleTimeString()}
              </p>
            </>
          }
        />
         <AccordionItem
          title="Members"
          content={
            <>
            {
              conversation.participants.map(part => (
                <div className="flex items-center my-3.5" key={part.id}>
                  <div>
                    <img className="w-10 rounded-full mr-3.5" src={part.user.avatar} alt=""/>
                  </div>
                  <div>
                    <p>{part.user.fullname}</p>
                    <p className="font-normal text-sm" style={{ color: '#9f9f9f' }}>{part.user.id === conversation.createdBy.id ? 'Group creator' : 'Member'}</p>
                  </div>
                </div>
              ))
            }
            </>
          }
        />
        <AccordionItem
          title="Customize Conversation"
          content={
            <>
              <div className="option_collapse_expand flex items-center my-3.5 cursor-pointer" onClick={() => dispatch({ type: GLOBALTYPES.MODAL, payload: { editChat: conversation}})}>
                <MdOutlineDriveFileRenameOutline className="icon_option"/>
                <p>
                  Change Name 
                </p>
              </div>
              <div className="option_collapse_expand flex items-center my-3.5 cursor-pointer" onClick={() => dispatch({ type: GLOBALTYPES.MODAL, payload: { editThumbnail: conversation}})}>
                <MdOutlineInsertPhoto className="icon_option"/>
                <p>
                  Change Photo
                </p>
              </div>
              <div className="option_collapse_expand flex items-center my-3.5 cursor-pointer">
                <IoColorPaletteOutline className="icon_option"/>
                <p>
                  Change Color
                </p>
              </div>
            </>
          }
        />
        <AccordionItem
          title="Media files"
          content={
            <>
              <ul>
                <li>
                  <a href="https://flowbite.com/pro/">Flowbite Pro</a>
                </li>
                <li>
                  <a href="https://tailwindui.com/">Tailwind UI</a>
                </li>
              </ul>
            </>
          }
        />
      </div>
    </div>
  );
};

export default DetailConversation;
