const MainMenuConfirmation = ({ text, btn1, btn2, cancel }) => {
   const btnFunc1Position = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: btn1 && btn2 ? '25%' : '35%',
      transform: 'translate(-50%, 100%)',
   }
   const btnFunc2Position = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: btn2 ? '50%' : '0',
      transform: 'translate(-50%, 100%)',
   }
   const btnCancelPosition = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: btn1 && btn2 ? '75%' : '65%',
      transform: 'translate(-50%, 100%)',
   }

   return (
      <div className="modal-background">
         <div className="modal-confirmation center">
            {/* Confirmation Text */}
            <span>{text}</span>
            {/* Button 1 */}
            {btn1 && <div className="btn-action pointer" style={btnFunc1Position} onClick={btn1.func}>
               <span>{btn1.text}</span>
            </div>}
            {/* Button 2 */}
            {btn2 && <div className="btn-action wider pointer" style={btnFunc2Position} onClick={btn2.func}>
               <span>{btn2.text}</span>
            </div>}
            {/* Button Cancel */}
            <div className="btn-cancel pointer" style={btnCancelPosition} onClick={cancel}>
               <span>CANCEL</span>
            </div>
         </div>
      </div>
   )
}

export default MainMenuConfirmation
