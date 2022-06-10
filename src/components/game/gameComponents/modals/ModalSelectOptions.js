/* Used to show ONE card with possible options to select */
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
   )
}

export default ModalSelectOptions
