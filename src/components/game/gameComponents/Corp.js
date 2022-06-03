import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../Game'
import iconEcoline from '../../../assets/images/corps/ecoline.svg'

const Corp = ({ corp, selectedCorp, setSelectedCorp, id }) => {
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)

   const handleCorpClick = (e) => {
      e.stopPropagation()
      if (!stateGame.phaseCorporation) return
      setSelectedCorp(id)
   }

   return (
      <div
         className={`
            corp
            ${modals.corp && 'modal center'}
            ${selectedCorp === id && selectedCorp !== undefined && 'selected'}
            ${modals.corps && 'pointer'}
         `}
         onClick={handleCorpClick}
      >
         <img src={iconEcoline} alt="" />
      </div>
   )
}

export default Corp
