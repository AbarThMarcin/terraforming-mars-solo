import React from 'react'

const BtnGoBack = ({ action }) => {
   const text = '<'
   return (
      <div className="go-back" onClick={action}>
         {text}
      </div>
   )
}

export default BtnGoBack
