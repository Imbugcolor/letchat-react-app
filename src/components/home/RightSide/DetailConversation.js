import React, { useEffect, useState } from "react";
import AccordionItem from "../../accordion/AccordionItem";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../../redux/types/global.type";
import { useParams } from "react-router-dom";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

const DetailConversation = () => {
  const auth = useSelector(state => state.auth)
  const message = useSelector(state => state.message)
  const media = useSelector(state => state.media)
  const status = useSelector(state => state.status)
  const dispatch = useDispatch()
  const [conversation, setConversation] = useState()
  const [loadMedia, setLoadMedia] = useState(false)
  const [mediaData, setMediaData] = useState([])
  const [usersOnline, setUsersOnline] = useState([])

  const { id } = useParams();

  useEffect(() => {
    const online = [];
    if (conversation && conversation.participants && conversation.participants.length > 0) {
      conversation.participants.forEach(part => {
          if (status.some(id => id === part.user.id)) {
            return online.push(part.user)
          }
      })
    }
    setUsersOnline(online)
  },[id, status, conversation])

  useEffect(() => {
    if(id && message.conversations.length > 0) {
      const data = message.conversations.find(cv => cv.id === parseInt(id))
      setConversation(data);
    }
  },[id, message.conversations])

  useEffect(() => {
    const mediaData = media.find(md => md.conversationId === Number(id))
    if (!mediaData) { 
      setLoadMedia(true) 
    } else {
      const mediaFiles = mediaData.data
      setLoadMedia(false) 
      setMediaData(mediaFiles)
    }

  },[media, id])

  if (!conversation) return <></>
  return (
    <div className="w-2/5 border-l px-5">
      <div className="flex flex-col">
        <div className="font-semibold text-xl py-4">{conversation.name || conversation.createdBy.username} Group</div>
        <img
          src={conversation.thumbnail}
          className="h-64 w-64 m-auto"
          alt=""
        />
        <div className="py-4 flex items-center"><GoDotFill style={{ color: 'green' }}/> {usersOnline.length} online</div>
      </div>
      <div className="accordion font-medium">
        <AccordionItem
          conversationId={conversation.id}
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
          conversationId={conversation.id}
          title="Members"
          content={
            <>
            {
              conversation.participants.map(part => (
                <div className="flex items-center my-3.5" key={part.id}>
                  <div className="mr-3.5">
                    <img className="w-10 rounded-full" src={part.user.avatar} alt=""/>
                  </div>
                  <div className="flex items-center justify-between w-4/5">
                    <div>
                      <p>{part.user.fullname}</p>
                      <p className="font-normal text-sm" style={{ color: '#9f9f9f' }}>{part.user.id === conversation.createdBy.id ? 'Group creator' : 'Member'}</p>
                    </div>
                    <div>
                      {
                        usersOnline.some(usr => usr.id === part.user.id) &&
                        <GoDotFill style={{ color: 'green' }}/>
                      }
                    </div>
                  </div>
                </div>
              ))
            }
            </>
          }
        />
        {
          conversation.createdBy.id === auth.user.id &&
          <AccordionItem
            conversationId={conversation.id}
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
        }
        <AccordionItem
          conversationId={conversation.id}
          title="Media files"
          content={
            loadMedia ? <div>loading</div> :
            <div className="flex">
              {
                mediaData.length > 0 ? mediaData.map(md => (
                  <div key={md.id} className="w-12">
                    <img src={md.url} alt=""/>
                  </div>
                )) : 'No media files yet'
              }
            </div>
          }
        />
      </div>
    </div>
  );
};

export default DetailConversation;
