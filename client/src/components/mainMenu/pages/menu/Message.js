import React from 'react'

const Message = ({ msg, type }) => {
   return (
      <div className={`message ${type}`}>
         <span>{msg}</span>
      </div>
   )
}

export default Message
