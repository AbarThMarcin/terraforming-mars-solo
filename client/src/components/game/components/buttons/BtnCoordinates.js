const BtnCoordinates = ({ showCoordinates, setShowCoordinates }) => {
   return (
      <div className="board-btn pointer" onClick={() => setShowCoordinates((prev) => !prev)}>
         {showCoordinates ? 'HIDE' : 'SHOW'} COORDINATES
      </div>
   )
}

export default BtnCoordinates
