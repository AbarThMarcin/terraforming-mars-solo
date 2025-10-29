import { useContext } from 'react'
import { MATCH_TYPES } from '../../../../data/app'
import { ActionsContext, ModalsContext, StatePlayerContext, UserContext } from '../..'
import { getAllResourcesInMlnOnlyHeat } from '../../../../utils/misc'

const BtnSelect = ({ handleClick, cardId, sourceCardId }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals } = useContext(ModalsContext)
   const { type } = useContext(UserContext)
   const { actions } = useContext(ActionsContext)

   const isReplay = type === MATCH_TYPES.REPLAY ? true : false
   const isSelected = actions.ids.includes(cardId)

   return (
      <div
         className={`${!isReplay ? 'pointer ' : ''}${isSelected ? 'btn-selected' : 'btn-select'}`}
         onClick={(e) => {
            e.stopPropagation()
            if (isReplay) return
            // If search for life action, don't allow to select / unselect card
            if (sourceCardId === 5) return
            // If Inventors' Guild or Business Network and resources are less than 3,
            // don't allow to select / unselect card
            const resources = getAllResourcesInMlnOnlyHeat(statePlayer)
            if (resources !== undefined) {
               if (resources < 3 && !modals.sellCards) return
            }
            handleClick()
         }}
      >
         {isSelected ? 'SELECTED' : 'SELECT'}
      </div>
   )
}

export default BtnSelect
