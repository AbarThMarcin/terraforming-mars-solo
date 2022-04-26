import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../Game'

const AnimProductionOut = () => {
   const { modals } = useContext(ModalsContext)
   const { ANIMATION_SPEED } = useContext(StateGameContext)

   return (
      <div
         className="anim-res-prod anim-production-out"
         style={{ animationDuration: `${ANIMATION_SPEED - 10}ms` }}
      >
         {modals.animationData.productionOut.type}
         {modals.animationData.productionOut.value}
      </div>
   )
}

export default AnimProductionOut
