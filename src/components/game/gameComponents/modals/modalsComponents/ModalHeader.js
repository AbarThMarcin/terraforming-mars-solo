const ModalHeader = ({ text, eachText }) => {
   return (
      <div className="modal-draft-header">
         <div className="modal-draft-header-text center">{text}</div>
         <div className="modal-draft-header-eachText">{eachText}</div>
      </div>
   )
}

export default ModalHeader
