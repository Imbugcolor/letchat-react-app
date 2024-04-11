import React from 'react'
import Logo from '../images/logo.png'
import LoadingGIF from '../images/loading5.gif'

const Loading = () => {
  return (
    <div className="fixed w-screen h-screen text-center" 
        style={{ background: '#fff', color: 'white', top: 0, left: 0, zIndex: 50, paddingTop: '150px' }}>
        <div className='w-screen flex justify-center items-center'><img src={Logo} alt=''/></div>
        <div className='w-screen flex justify-center items-center'><img src={LoadingGIF} alt='' style={{ width: '250px' }}/></div>
    </div>
  )
}

export default Loading