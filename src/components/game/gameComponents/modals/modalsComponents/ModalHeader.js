const ModalHeader = ({ text, eachText }) => {
   return (
      <div className="header">
         <div className="text center">{text}</div>
         {eachText && <div className="eachText">{eachText}</div>}
      </div>
   )
}

export default ModalHeader
