import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../Game'

const AnimProductionIn = () => {
   const { modals } = useContext(ModalsContext)
   const { ANIMATION_SPEED } = useContext(StateGameContext)

   return (
      <div
         className="anim-res-prod anim-production-in"
         style={{ animationDuration: `${ANIMATION_SPEED - 10}ms` }}
      >
         {modals.animationData.productionIn.type}
         {modals.animationData.productionIn.value}
      </div>
   )
}

export default AnimProductionIn
