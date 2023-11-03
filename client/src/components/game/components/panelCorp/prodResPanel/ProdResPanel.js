import { useContext } from 'react'
import { StatePlayerContext } from '../../../../game'
import ProdResSnap from './ProdResSnap'
import { getResIcon, RESOURCES } from '../../../../../data/resources'
import { useActionHeatGreenery } from '../../../../../hooks/useActionHeatGreenery'

const ProdResPanel = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { onYesFuncGreenery, onYesFuncHeat } = useActionHeatGreenery()

   return (
      <div className="prod-res-panel">
         <ProdResSnap
            prod={statePlayer.production.mln}
            res={statePlayer.resources.mln}
            icon={getResIcon(RESOURCES.MLN)}
            action={{ func: null, type: null }}
            resource={RESOURCES.MLN}
         />
         <ProdResSnap
            prod={statePlayer.production.steel}
            res={statePlayer.resources.steel}
            icon={getResIcon(RESOURCES.STEEL)}
            action={{ func: null, type: null }}
            resource={RESOURCES.STEEL}
         />
         <ProdResSnap
            prod={statePlayer.production.titan}
            res={statePlayer.resources.titan}
            icon={getResIcon(RESOURCES.TITAN)}
            action={{ func: null, type: null }}
            resource={RESOURCES.TITAN}
         />
         <ProdResSnap
            prod={statePlayer.production.plant}
            res={statePlayer.resources.plant}
            icon={getResIcon(RESOURCES.PLANT)}
            action={{ func: onYesFuncGreenery, type: 'greenery' }}
            resource={RESOURCES.PLANT}
         />
         <ProdResSnap
            prod={statePlayer.production.energy}
            res={statePlayer.resources.energy}
            icon={getResIcon(RESOURCES.ENERGY)}
            action={{ func: null, type: null }}
            resource={RESOURCES.ENERGY}
         />
         <ProdResSnap
            prod={statePlayer.production.heat}
            res={statePlayer.resources.heat}
            icon={getResIcon(RESOURCES.HEAT)}
            action={{ func: onYesFuncHeat, type: 'temperature' }}
            resource={RESOURCES.HEAT}
         />
      </div>
   )
}

export default ProdResPanel
