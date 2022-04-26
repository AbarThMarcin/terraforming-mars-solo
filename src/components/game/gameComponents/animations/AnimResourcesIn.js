import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../Game'

const AnimResourcesIn = () => {
   const { modals } = useContext(ModalsContext)
   const { ANIMATION_SPEED } = useContext(StateGameContext)

   return (
      <div
         className="anim-res-prod anim-resources-in"
         style={{ animationDuration: `${ANIMATION_SPEED - 10}ms` }}
      >
         {modals.animationData.resourcesIn.type}
         {modals.animationData.resourcesIn.value}
      </div>
   )
}

export default AnimResourcesIn
