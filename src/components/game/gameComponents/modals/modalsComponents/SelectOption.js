import { useContext } from 'react'
import { getOptionIcon } from '../../../../../data/selectOneOptions'
import { StateGameContext, ModalsContext } from '../../../Game'

const SelectOption = ({ idx, option, selectedOption, setSelectedOption }) => {
   const { optionRequirementsMet } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)
   const isAvailable = optionRequirementsMet(option)

   const handleClickOption = (option) => {
      if (isAvailable) setSelectedOption(option)
   }

   return (
      <div
         className={`
            option
            ${isAvailable && 'pointer'}
            ${option === selectedOption && 'selected'}
         `}
         onClick={() => handleClickOption(option)}
      >
         <img
            src={getOptionIcon(option)}
            alt={`${modals.modalSelectOne.card.name}_opt_${idx + 1}`}
         />
         <div className={`${!isAvailable && 'disabled'} full-size`}></div>
      </div>
   )
}

export default SelectOption
