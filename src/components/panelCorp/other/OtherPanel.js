import { useContext } from 'react'
import OtherBtn from './OtherBtn'
import { StatePlayerContext } from '../../../Game'

const OtherPanel = () => {
   const { statePlayer } = useContext(StatePlayerContext)

   const getTotalVp = () => {
      let vps = 0
      statePlayer.vp.forEach((card) => {
         vps += card.vp
      })
      return vps
   }

   return (
      <div className="other">
         <OtherBtn
            headerForModal="CARD RESOURCES"
            amountForModal={statePlayer.cardResources.length}
            dataForModal={statePlayer.cardResources}
            icon={null}
         />
         <OtherBtn
            headerForModal="TAGS"
            amountForModal={statePlayer.tags.length}
            dataForModal={statePlayer.tags}
            icon={null}
         />
         <OtherBtn
            headerForModal="VP"
            amountForModal={getTotalVp()}
            dataForModal={statePlayer.vp}
            icon={null}
         />
         <OtherBtn
            headerForModal="ACTIONS"
            amountForModal={statePlayer.actions.length}
            dataForModal={statePlayer.actions}
            icon={null}
         />
         <OtherBtn
            headerForModal="EFFECTS"
            amountForModal={statePlayer.effects.length}
            dataForModal={statePlayer.effects}
            icon={null}
         />
      </div>
   )
}

export default OtherPanel
