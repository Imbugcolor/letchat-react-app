import React from 'react'

const Loading = () => {
  return (
    <div className="fixed w-screen h-screen text-center loading" 
        style={{background: '#0008', color: 'white', top: 0, left: 0, zIndex: 50}}>
        <div className="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
    </div>
  )
}

export default Loading