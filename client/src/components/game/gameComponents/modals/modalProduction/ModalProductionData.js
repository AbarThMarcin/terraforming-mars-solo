import { useContext } from 'react'
import { StatePlayerContext, StateGameContext, ModalsContext } from '../../../Game'
import { getProdImmEffectIcon } from '../../../../../data/immEffects/prodImmEffectsIcons'
import { ANIMATIONS } from '../../../../../data/animations'
import { CORP_NAMES } from '../../../../../data/corpNames'
import { IMM_EFFECTS } from '../../../../../data/immEffects/immEffects'

const ModalProductionData = ({ setCardSnap }) => {
   const { stateGame, getImmEffects } = useContext(StateGameContext)
   const { statePlayer } = useContext(StatePlayerContext)
   const { modals, setModals } = useContext(ModalsContext)

   const handleClickProdCard = (itemIdOrCorpName) => {
      let immProdEffects = []
      // Assign Mining Guild production immediate effect
      if (itemIdOrCorpName === CORP_NAMES.MINING_GUILD) {
         immProdEffects = getImmEffects(IMM_EFFECTS.MINING_GUILD)
         // Assign Mining Area production subAction
      } else if (itemIdOrCorpName === 64) {
         immProdEffects = [modals.modalProduction.miningArea]
         // Assign Mining Rights production subAction
      } else if (itemIdOrCorpName === 67) {
         immProdEffects = [modals.modalProduction.miningRights]
         // Assign Any other card's production subAction
      } else {
         immProdEffects = getImmEffects(itemIdOrCorpName).filter(
            (immProdEffect) =>
               immProdEffect.name === ANIMATIONS.PRODUCTION_IN ||
               immProdEffect.name === ANIMATIONS.PRODUCTION_OUT
         )
      }
      setModals((prev) => ({
         ...prev,
         modalProduction: {
            ...prev.modalProduction,
            cardIdOrCorpName: itemIdOrCorpName,
            immProdEffects: immProdEffects,
         },
      }))
   }

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
                  <img
                     src={getProdImmEffectIcon(statePlayer.corporation.name)}
                     className="img-prod"
                     alt="miningGuild_prodIcon"
                  />
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
                  <img
                     src={getProdImmEffectIcon(item.id, modals)}
                     className="img-prod"
                     alt={`card_${item.id}_prodIcon`}
                  />
               </div>
            </div>
         ))}
      </div>
   )
}

export default ModalProductionData
