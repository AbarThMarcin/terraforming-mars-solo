/* A container of all possible modals */
import { useContext } from 'react'
import { ModalsContext } from '../../Game'
import ModalCards from './ModalCards'
import ModalCardViewOnly from './ModalCardViewOnly'
import ModalCardWithAction from './ModalCardWithAction'
import ModalConfirmation from './ModalConfirmation'
import ModalCorp from './ModalCorp'
import ModalCorps from './ModalCorps'
import ModalDraft from './ModalDraft'
import ModalSellCards from './ModalSellCards'
import ModalLog from './ModalLog'
import ModalMenu from './ModalMenu'
import ModalOther from './modalOther/ModalOther'
import ModalRules from './ModalRules'
import ModalSettings from './ModalSettings'
import ModalStandardProjects from './ModalStandardProjects'
import ModalResource from './modalResources/ModalResource'
import ModalSelectOne from './ModalSelectOne'
import ModalSelectCard from './ModalSelectCard'

const Modals = ({ setGameOn }) => {
   const { modals } = useContext(ModalsContext)

   return (
      <>
         {modals.sellCards && <ModalSellCards />}
         {modals.corps && <ModalCorps />}
         {modals.log && <ModalLog />}
         {modals.standardProjects && <ModalStandardProjects />}
         {modals.draft && <ModalDraft />}
         {modals.cards && <ModalCards />}
         {modals.other && <ModalOther />}
         {modals.resource && <ModalResource />}
         {modals.selectOne && <ModalSelectOne />}
         {modals.selectCard && <ModalSelectCard />}
         {modals.corp && <ModalCorp />}
         {modals.cardWithAction && <ModalCardWithAction />}
         {modals.cardViewOnly && <ModalCardViewOnly />}
         {modals.animation && <div className="full-size"></div>}
         {modals.menu && <ModalMenu setGameOn={setGameOn} />}
         {modals.settings && <ModalSettings />}
         {modals.rules && <ModalRules />}
         {modals.confirmation && <ModalConfirmation />}
      </>
   )
}

export default Modals
