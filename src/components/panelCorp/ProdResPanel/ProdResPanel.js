import { useContext } from 'react'
import { StatePlayerContext } from '../../../Game'
import ProdResSnap from './ProdResSnap'

const ProdResPanel = () => {
   const { statePlayer } = useContext(StatePlayerContext)

   return (
      <div className="prod-res-panel">
         <ProdResSnap
            prod={statePlayer.production.mln}
            res={statePlayer.resources.mln}
            icon={null}
         />
         <ProdResSnap
            prod={statePlayer.production.steel}
            res={statePlayer.resources.steel}
            icon={null}
         />
         <ProdResSnap
            prod={statePlayer.production.titan}
            res={statePlayer.resources.titan}
            icon={null}
         />
         <ProdResSnap
            prod={statePlayer.production.plants}
            res={statePlayer.resources.plants}
            icon={null}
         />
         <ProdResSnap
            prod={statePlayer.production.power}
            res={statePlayer.resources.power}
            icon={null}
         />
         <ProdResSnap
            prod={statePlayer.production.heat}
            res={statePlayer.resources.heat}
            icon={null}
         />
      </div>
   )
}

export default ProdResPanel
