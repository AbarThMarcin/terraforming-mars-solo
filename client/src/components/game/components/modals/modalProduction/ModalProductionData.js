import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../../game'
import { getProdImmEffectIcon } from '../../../../../data/immEffects/prodImmEffectsIcons'
import { CORP_NAMES } from '../../../../../data/corpNames'
import { useSubactionProduction } from '../../../../../hooks/useSubactionProduction'

const ModalProductionData = ({ setCardSnap }) => {
   const { stateGame } = useContext(StateGameContext)
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals } = useContext(ModalsContext)

   const { handleClickProdCard } = useSubactionProduction()

   return (
      <div className="modal-other-data center">
         {/* CORPORATION PRODUCTION */}
         {statePlayer.corporation.name === CORP_NAMES.MINING_GUILD && (
            <div
               className={`
               modal-other-data-item
               ${stateGame.phaseAddRemoveRes && 'pointer'}
               ${modals.modalProduction.cardIdOrCorpName === CORP_NAMES.MINING_GUILD && 'selected'}
            `}
               onClick={() => handleClickProdCard(statePlayer.corporation.name)}
            >
               <div className="copy">{statePlayer.corporation.name}</div>
               <div className="copy">
                  <img src={getProdImmEffectIcon(statePlayer.corporation.name)} className="img-prod" alt="miningGuild_prodIcon" />
               </div>
            </div>
         )}
         {/* CARDS PRODUCTIONS */}
         {modals.modalProduction.data.map((item, idx) => (
            <div
               key={idx}
               className={`
                  modal-other-data-item
                  ${stateGame.phaseAddRemoveRes && 'pointer'}
                  ${modals.modalProduction.cardIdOrCorpName === item.id && 'selected'}
               `}
               onMouseOver={() => setCardSnap(item)}
               onMouseLeave={() => setCardSnap(null)}
               onClick={() => handleClickProdCard(item.id)}
            >
               <div className="copy">{item.name}</div>
               <div className="copy">
                  <img src={getProdImmEffectIcon(item.id, modals)} className="img-prod" alt={`card_${item.id}_prodIcon`} />
               </div>
            </div>
         ))}
      </div>
   )
}

export default ModalProductionData
