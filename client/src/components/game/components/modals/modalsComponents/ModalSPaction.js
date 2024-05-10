import { useContext } from 'react'
import { SP, getInitSPCosts } from '../../../../../data/StandardProjects'
import { StateGameContext, ActionsContext } from '../../../../game'
import BtnAction from '../../buttons/BtnAction'
import { useActionSP } from '../../../../../hooks/useActionSP'

const ModalSPaction = ({ id, icon, name, textConfirmation }) => {
   const { stateGame } = useContext(StateGameContext)
   const { actions } = useContext(ActionsContext)

   const { SPrequirementsMet, handleClickBtn } = useActionSP()

   const initCosts = getInitSPCosts(stateGame)[id]
   const currentCost = id === actions.id ? initCosts - actions.heat : initCosts

   const isAvailable = SPrequirementsMet(id, currentCost)
   const styles = name === SP.GREENERY ? { transform: 'translateX(8%)' } : name === SP.CITY ? { transform: 'translateX(4%)' } : {}

   const btnSPActionPosition = { right: '8%', top: '50%', transform: 'translateY(-50%) scale(0.9)' }

   return (
      <div className={`sp-action ${!isAvailable && 'disabled'} ${id === actions.id && 'selected-sp'}` }>
         {/* Icon */}
         <div className="sp-action-element icon">
            <div>
               <img style={styles} src={icon} alt={`icon_${name}`} />
            </div>
         </div>
         {/* Name */}
         <div className="sp-action-element name">{name}</div>
         {/* Button */}
         <BtnAction
            text="USE"
            mln={currentCost}
            onYesFunc={() => handleClickBtn(id, name, textConfirmation, currentCost, isAvailable)}
            disabled={!isAvailable}
            position={btnSPActionPosition}
         />
      </div>
   )
}

export default ModalSPaction
