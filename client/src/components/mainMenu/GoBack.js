import React from 'react'

const GoBack = ({ action }) => {
   const text = '<'
   return (
      <div className="go-back" onClick={action}>
         {text}
      </div>
   )
}

export default GoBack
