import { useContext } from 'react'
import { ModalsContext } from '../../../../game'
import BtnAction from '../../buttons/BtnAction'
import SelectOption from './SelectOption'
import { useSubactionSelectOption } from '../../../../../hooks/useSubactionSelectOption'

const SelectOptionSection = ({ selectedOption, setSelectedOption }) => {
   const { modals } = useContext(ModalsContext)

   const btnActionConfirmPosition = {
      bottom: '-5%',
      left: '50%',
      transform: 'translate(-50%, 110%)',
   }

   const { onConfirmSelectOption } = useSubactionSelectOption({ selectedOption })

   return (
      <div className="select-one-section">
         {/* HEADER */}
         <div className="header">SELECT ONE</div>
         {/* OPTIONS */}
         {modals.modalSelectOne.options.map((option, idx) => (
            <SelectOption key={idx} idx={idx} option={option} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
         ))}
         {/* CONFIRM BUTTON */}
         <BtnAction text="CONFIRM" onYesFunc={onConfirmSelectOption} position={btnActionConfirmPosition} />
      </div>
   )
}

export default SelectOptionSection
