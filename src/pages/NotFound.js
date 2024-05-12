import React from 'react'

const NotFound = () => {
  return (
    <div className="relative" style={{
      minHeight: 'calc(100vh - 70px)'}}>
        <h2 className="absolute text-secondary"
        style={{top:'50%', left:'50%', transform: 'translate(-50%, -50%)'}}
        >
         404 | NOT FOUND
        </h2>
    </div>  
  )
}

export default NotFound
