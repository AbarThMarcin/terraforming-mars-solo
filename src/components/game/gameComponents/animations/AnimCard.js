import { useContext } from 'react'
import { getResIcon, RESOURCES } from '../../../../data/resources'
import { StateGameContext, ModalsContext } from '../../Game'

const AnimCard = ({ type }) => {
   const { modals } = useContext(ModalsContext)
   const { ANIMATION_SPEED } = useContext(StateGameContext)
   const value = getValue()

   function getValue() {
      if (modals.animationData.cardIn.type) {
         return modals.animationData.cardIn.value
      } else if (modals.animationData.cardOut.type) {
         return modals.animationData.cardOut.value
      }
      return
   }

   return (
      <div
         className={`anim-card ${type === 'card-in' ? 'anim-card-in' : 'anim-card-out'}`}
         style={{ animationDuration: `${ANIMATION_SPEED}ms` }}
      >
         <img src={getResIcon(RESOURCES.CARD)} className="full-size" alt="card" />
         <div className="value center">{value}</div>
      </div>
   )
}

export default AnimCard
