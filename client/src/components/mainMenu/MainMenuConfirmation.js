const MainMenuConfirmation = ({ text, btnText1, btnText2, func1, func2, cancel }) => {
   const btnFunc1Position = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: '25%',
      transform: 'translate(-50%, 100%)',
   }
   const btnFunc2Position = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: '50%',
      transform: 'translate(-50%, 100%)',
   }
   const btnCancelPosition = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: '75%',
      transform: 'translate(-50%, 100%)',
   }

   return (
      <div className="modal-background">
         <div className="modal-confirmation center">
            {/* Confirmation Text */}
            <span>{text}</span>
            {/* Button Yes */}
            <div className="btn-action pointer" style={btnFunc1Position} onClick={func1}>
               <span>{btnText1}</span>
            </div>
            {/* Button No */}
            <div className="btn-action wider pointer" style={btnFunc2Position} onClick={func2}>
               <span>{btnText2}</span>
            </div>
            <div className="btn-cancel pointer" style={btnCancelPosition} onClick={cancel}>
               <span>CANCEL</span>
            </div>
         </div>
      </div>
   )
}

export default MainMenuConfirmation
