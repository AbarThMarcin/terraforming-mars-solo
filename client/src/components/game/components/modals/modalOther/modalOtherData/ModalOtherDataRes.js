import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../../game'
import { getResIcon, RESOURCES } from '../../../../../../data/resources'
import { getCardsWithPossibleAnimals, getCardsWithPossibleFighters, getCardsWithPossibleMicrobes, getCardsWithPossibleScience } from '../../../../../../utils/misc'

const ModalOtherDataRes = ({ setCardSnap, selectedCardId, setSelectedCardId }) => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)

   const handleClickResCard = (id) => {
      if (setSelectedCardId !== undefined) setSelectedCardId(id)
   }

   return (
      <div className="modal-other-data center">
         {modals.modalOther.data.map((item, idx) => (
            <div
               key={idx}
               className={`
                  modal-other-data-item
                  ${stateGame.phaseAddRemoveRes && 'pointer'}
                  ${selectedCardId === item.id && 'selected'}
               `}
               onMouseOver={() => setCardSnap(item)}
               onMouseLeave={() => setCardSnap(null)}
               onClick={() => handleClickResCard(item.id)}
            >
               <span>{item.name}</span>
               <div>
                  <span>{item.units.microbe + item.units.animal + item.units.science + item.units.fighter} </span>
                  {(item.units.microbe !== 0 || (stateGame.phaseAddRemoveRes && getCardsWithPossibleMicrobes(statePlayer).some((card) => card.id === item.id))) && (
                     <img src={getResIcon(RESOURCES.MICROBE)} className="img-res" alt="microbe" />
                  )}
                  {(item.units.animal !== 0 || (stateGame.phaseAddRemoveRes && getCardsWithPossibleAnimals(statePlayer).some((card) => card.id === item.id))) && (
                     <img src={getResIcon(RESOURCES.ANIMAL)} className="img-res" alt="animal" />
                  )}
                  {(item.units.science !== 0 || (stateGame.phaseAddRemoveRes && getCardsWithPossibleScience(statePlayer).some((card) => card.id === item.id))) && (
                     <img src={getResIcon(RESOURCES.SCIENCE)} className="img-res" alt="science" />
                  )}
                  {(item.units.fighter !== 0 || (stateGame.phaseAddRemoveRes && getCardsWithPossibleFighters(statePlayer).some((card) => card.id === item.id))) && (
                     <img src={getResIcon(RESOURCES.FIGHTER)} className="img-res" alt="fighter" />
                  )}
               </div>
            </div>
         ))}
      </div>
   )
}

export default ModalOtherDataRes
