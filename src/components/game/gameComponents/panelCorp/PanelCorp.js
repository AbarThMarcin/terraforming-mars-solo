import CorpSnap from './CorpSnap'
import ProdResPanel from './ProdResPanel/ProdResPanel'
import CardsInHandBtn from './CardsInHandBtn'
import OtherPanel from './other/OtherPanel'
import BtnCardsPlayed from './buttons/BtnCardsPlayed'
import BtnLog from './buttons/BtnLog'
import { StateGameContext, ModalsContext } from '../../Game'
import { useContext } from 'react'

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
            <div className="btns-cards-played-log-container">
               <BtnCardsPlayed />
               <BtnLog />
            </div>
         )}
      </div>
   )
}

export default PanelCorp
