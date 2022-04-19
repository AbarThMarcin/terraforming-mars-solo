import CorpSnap from './CorpSnap'
import ProdResPanel from './ProdResPanel/ProdResPanel'
import CardsInHandBtn from './CardsInHandBtn'
import OtherPanel from './other/OtherPanel'
import BtnCardsPlayed from './buttons/BtnCardsPlayed'
import BtnLog from './buttons/BtnLog'
import { ModalsContext } from '../../Game'
import { useContext } from 'react'

const PanelCorp = () => {
   const { modals } = useContext(ModalsContext)

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
      </div>
   )
}

export default PanelCorp
