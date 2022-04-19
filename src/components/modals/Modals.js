import { useContext } from 'react'
import { ModalsContext } from '../../Game'
import ModalCards from './modalCards/ModalCards'
import ModalCardViewOnly from './ModalCardViewOnly'
import ModalCardWithAction from './ModalCardWithAction'
import ModalConfirmation from './ModalConfirmation'
import ModalCorp from './ModalCorp'
import ModalCorps from './ModalCorps'
import ModalDraft from './modalDraft/ModalDraft'
import ModalLog from './ModalLog'
import ModalMenu from './ModalMenu'
import ModalOther from './modalOther/ModalOther'
import ModalRules from './ModalRules'
import ModalSettings from './ModalSettings'
import ModalStandardProjects from './modalStandardProjects/ModalStandardProjects'

const Modals = ({ setGameOn }) => {
   const { modals } = useContext(ModalsContext)

   return (
      <>
         {modals.draft && <ModalDraft />}
         {modals.cards && <ModalCards />}
         {modals.cardWithAction && <ModalCardWithAction />}
         {modals.cardViewOnly && <ModalCardViewOnly />}
         {modals.corp && <ModalCorp />}
         {modals.corps && <ModalCorps />}
         {modals.log && <ModalLog />}
         {modals.other && <ModalOther />}
         {modals.standardProjects && <ModalStandardProjects />}
         {modals.menu && <ModalMenu setGameOn={setGameOn} />}
         {modals.settings && <ModalSettings />}
         {modals.rules && <ModalRules />}
         {modals.confirmation && <ModalConfirmation />}
      </>
   )
}

export default Modals
