import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../Game'

const AnimResourcesOut = () => {
   const { modals } = useContext(ModalsContext)
   const { ANIMATION_SPEED } = useContext(StateGameContext)

   return (
      <div
         className="anim-res-prod anim-resources-out"
         style={{ animationDuration: `${ANIMATION_SPEED - 10}ms` }}
      >
         {modals.animationData.resourcesOut.type}
         {modals.animationData.resourcesOut.value}
      </div>
   )
}

export default AnimResourcesOut
