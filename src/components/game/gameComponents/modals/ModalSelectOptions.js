import { useContext, useState } from 'react'
import { getOptions } from '../../../../data/selectOneOptions'
import { ModalsContext } from '../../Game'
import Card from '../Card'
import InsulationSection from './modalsComponents/InsulationSection'
import PowerInfrasSection from './modalsComponents/PowerInfrasSection'
import SelectOptionSection from './modalsComponents/SelectOptionSection'

const ModalSelectOptions = () => {
   const { modals } = useContext(ModalsContext)
   const [selectedOption, setSelectedOption] = useState(
      getOptions(modals.modalSelectOne.card.id)[0]
   )

   return (
      <div className={`modal-card-container full-size ${modals.confirmation && 'display-none'}`}>
         <div className="modal-card center">
            <div className="card-container big center">
               <Card card={modals.modalSelectOne.card} isBig={true} />
               {modals.modalSelectOne.card.id === 194 ? (
                  // Power Infrastructure
                  <PowerInfrasSection />
               ) : modals.modalSelectOne.card.id === 152 ? (
                  // Insulation
                  <InsulationSection />
               ) : (
                  // Any other card with options
                  <SelectOptionSection
                     selectedOption={selectedOption}
                     setSelectedOption={setSelectedOption}
                  />
               )}
            </div>
         </div>
      </div>
   )
}

export default ModalSelectOptions
