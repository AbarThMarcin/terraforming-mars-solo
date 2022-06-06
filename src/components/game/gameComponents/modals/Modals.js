/* A container of all possible modals */
import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../Game'
import ModalCards from './ModalCards'
import ModalCardViewOnly from './ModalCardViewOnly'
import ModalCardWithAction from './ModalCardWithAction'
import ModalConfirmation from './ModalConfirmation'
import ModalCorp from './ModalCorp'
import ModalCorps from './ModalCorps'
import ModalDraft from './ModalDraft'
import ModalSellCards from './ModalSellCards'
import ModalLog from './modalLog/ModalLog'
import ModalMenu from './ModalMenu'
import ModalOther from './modalOther/ModalOther'
import ModalRules from './ModalRules'
import ModalSettings from './ModalSettings'
import ModalStandardProjects from './ModalStandardProjects'
import ModalResource from './modalResources/ModalResource'
import ModalSelectOne from './ModalSelectOptions'
import ModalSelectCard from './ModalSelectCard'
import ModalProduction from './modalProduction/ModalProduction'
import ModalMarsUniversity from './ModalMarsUniversity'
import ModalBusinessContacts from './ModalBusinessContacts'
import BtnViewGameState from '../../gameComponents/buttons/BtnViewGameState'

const Modals = ({ setGameOn, setAnimationSpeed, logItems }) => {
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)

   return (
      <>
         {modals.sellCards && <ModalSellCards />}
         {modals.marsUniversity && <ModalMarsUniversity />}
         {modals.businessContacts && <ModalBusinessContacts />}
         {modals.corps && <ModalCorps />}
         {modals.standardProjects && <ModalStandardProjects />}
         {modals.draft && <ModalDraft />}
         {modals.resource && <ModalResource />}
         {modals.production && <ModalProduction />}
         {modals.selectOne && <ModalSelectOne />}
         {modals.selectCard && <ModalSelectCard />}
         {(stateGame.phaseDraft ||
            modals.sellCards ||
            stateGame.phaseAddRemoveRes ||
            modals.selectCard ||
            modals.marsUniversity ||
            modals.businessContacts) && <BtnViewGameState />}
         {modals.log && <ModalLog logItems={logItems} />}
         {modals.cards && <ModalCards />}
         {modals.other && <ModalOther />}
         {modals.corp && <ModalCorp />}
         {modals.cardWithAction && <ModalCardWithAction />}
         {modals.cardViewOnly && <ModalCardViewOnly />}
         {modals.animation && <div className="full-size"></div>}
         {modals.menu && <ModalMenu setGameOn={setGameOn} />}
         {modals.settings && <ModalSettings setAnimationSpeed={setAnimationSpeed} />}
         {modals.rules && <ModalRules />}
         {modals.confirmation && <ModalConfirmation />}
      </>
   )
}

export default Modals
