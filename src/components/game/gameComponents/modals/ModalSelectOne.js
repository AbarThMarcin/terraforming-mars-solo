import { useContext, useState } from 'react'
import { getOptions } from '../../../../data/selectOneOptions'
import { ModalsContext } from '../../Game'
import Card from '../Card'
import SelectOneSection from './modalsComponents/SelectOneSection'

const ModalSelectOne = () => {
   const { modals } = useContext(ModalsContext)
   const [selectedOption, setSelectedOption] = useState(getOptions(modals.modalSelectOne.card.id)[0])

   return (
      <div className={`modal-card-container full-size ${modals.confirmation && 'display-none'}`}>
         <div className="modal-card center">
            <div className="card-container big center">
               <Card card={modals.modalSelectOne.card} />
               <SelectOneSection
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
               />
            </div>
         </div>
      </div>
   )
}

export default ModalSelectOne
