const LogItemStateCards = ({ state, cardsType }) => {
   return (
      <div className="state-other-container">
         <div className="state-other-container-title">{cardsType}</div>
         <ul className="state-other-container-elements">
            {cardsType === 'CARDS IN HAND' ? (
               state.statePlayer.cardsInHand.length > 0 ? (
                  state.statePlayer.cardsInHand.map((card, idx) => (
                     <li key={idx}>
                        - {card.name} ({card.id})
                     </li>
                  ))
               ) : (
                  <li style={{ color: '#777' }}>NO CARDS IN HAND</li>
               )
            ) : state.statePlayer.cardsPlayed.length > 0 ? (
               state.statePlayer.cardsPlayed.map((card, idx) => (
                  <li key={idx}>
                     - {card.name} ({card.id})
                  </li>
               ))
            ) : (
               <li style={{ color: '#777' }}>NO CARDS PLAYED</li>
            )}
         </ul>
      </div>
   )
}

export default LogItemStateCards
