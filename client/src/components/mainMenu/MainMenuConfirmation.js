const MainMenuConfirmation = ({ onYes, onNo, onCancel }) => {
   const btnActionYesPosition = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: '25%',
      transform: 'translate(-50%, 100%)',
   }
   const btnActionNoPosition = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: '50%',
      transform: 'translate(-50%, 100%)',
   }
   const btnActionCancelPosition = {
      bottom: 'calc(var(--default-size) * -0.7)',
      left: '75%',
      transform: 'translate(-50%, 100%)',
   }

   return (
      <div className="modal-background">
         <div className="modal-confirmation center">
            {/* Confirmation Text */}
            <span>Do you want to resume previous game?</span>
            {/* Button Yes */}
            <div className="btn-action pointer" style={btnActionYesPosition} onClick={onYes}>
               <span>RESUME</span>
            </div>
            {/* Button No */}
            <div className="btn-action pointer" style={btnActionNoPosition} onClick={onNo}>
               <span>START NEW</span>
            </div>
            <div className="btn-cancel pointer" style={btnActionCancelPosition} onClick={onCancel}>
               <span>CANCEL</span>
            </div>
         </div>
      </div>
   )
}

export default MainMenuConfirmation
