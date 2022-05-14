import { useContext } from 'react'
import { getCorpLogo } from '../../../data/corporations'
import { StateGameContext, ModalsContext } from '../Game'

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
            ${modals.corp && 'center'}
            ${selectedCorp === id && selectedCorp !== undefined && 'selected'}
            ${modals.corps && 'pointer'}
         `}
         onClick={handleCorpClick}
      >
         <img src={getCorpLogo(corp.name)} alt={`${corp.name}_logo`} />
         <div className="corp-name">{corp.name}</div>
         <div className="corp-description">{corp.description}</div>
      </div>
   )
}

export default Corp
