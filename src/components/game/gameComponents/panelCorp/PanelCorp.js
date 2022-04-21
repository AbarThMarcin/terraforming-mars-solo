import CorpSnap from './CorpSnap'
import ProdResPanel from './ProdResPanel/ProdResPanel'
import CardsInHandBtn from './CardsInHandBtn'
import OtherPanel from './other/OtherPanel'
import BtnCardsPlayed from './buttons/BtnCardsPlayed'
import BtnLog from './buttons/BtnLog'
import { StateGameContext, ModalsContext } from '../../Game'
import { useContext } from 'react'
import BtnViewGameState from './buttons/BtnViewGameState'

const PanelCorp = () => {
   const { modals } = useContext(ModalsContext)
   const { stateGame } = useContext(StateGameContext)

   return (
      <div className="panel-corp">
         <CorpSnap />
         <ProdResPanel />
         <OtherPanel />
         <CardsInHandBtn />
         {!modals.cards && (
            <div className="panel-corp-btns">
               <BtnCardsPlayed />
               <BtnLog />
            </div>
         )}
         {stateGame.phaseDraft && <BtnViewGameState />}
      </div>
   )
}

export default PanelCorp
