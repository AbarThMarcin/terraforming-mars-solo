import CorpLogo from './CorpLogo'
import ProdResPanel from './prodResPanel/ProdResPanel'
import BtnCardsInHand from '../buttons/BtnCardsInHand'
import OtherPanel from './other/OtherPanel'
import BtnCardsPlayed from '../buttons/BtnCardsPlayed'
import BtnLog from '../buttons/BtnLog'
import { ModalsContext } from '../../../game'
import { useContext } from 'react'
import panelCorpBg from '../../../../assets/images/panelCorp/panelCorpBg.svg'

const PanelCorp = () => {
   const { modals } = useContext(ModalsContext)

   return (
      <>
         {/* Background */}
         <img src={panelCorpBg} alt="panel_corp_bg" />
         {/* Corporation Logo */}
         <CorpLogo />
         {/* Production / Resources Panel */}
         <ProdResPanel />
         {/* Card Resources / Tags / VP / Actions / Effects Panel */}
         <OtherPanel />
         {/* Cards In Hand Snap */}
         <BtnCardsInHand />
         {!modals.cards && (
            <div className="btns-cards-played-log-container">
               <BtnCardsPlayed />
               <BtnLog />
            </div>
         )}
      </>
   )
}

export default PanelCorp
