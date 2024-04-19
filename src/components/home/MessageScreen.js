import React from 'react'
import logo from '../../images/logo.png'
import { LuPlus } from "react-icons/lu";
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/types/global.type';

const MessageScreen = () => {
  const dispatch = useDispatch()
  return (
    <div className='w-full px-5 flex flex-col justify-between m-auto'>
      <div className='m-auto'>
        <img src={logo} alt=''/>
      </div>
      <button
        type="button"
        className="create_conversation__home m-auto flex items-center rounded-full bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
        onClick={() => dispatch({ type: GLOBALTYPES.MODAL, payload: { addChat: true } })}
      >
        <LuPlus className='mx-1'/> Create new conversation
      </button>
    </div>
  )
}

export default MessageScreen
