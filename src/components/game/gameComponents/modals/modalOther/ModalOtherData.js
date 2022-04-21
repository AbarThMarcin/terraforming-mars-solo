import { useContext } from 'react'
import { ModalsContext } from '../../../Game'
import ModalOtherRes from './ModalOtherRes'
import ModalOtherTags from './ModalOtherTags'
import ModalOtherVP from './ModalOtherVP'
import ModalOtherActions from './ModalOtherActions'
import ModalOtherEffects from './ModalOtherEffects'

const ModalOtherData = ({ setCardSnapForVP }) => {
   const { modals } = useContext(ModalsContext)

   return (
      <>
         {modals.modalOther.header === 'CARD RESOURCES' && <ModalOtherRes />}
         {modals.modalOther.header === 'TAGS' && <ModalOtherTags />}
         {modals.modalOther.header === 'VP' && <ModalOtherVP setCardSnapForVP={setCardSnapForVP} />}
         {modals.modalOther.header === 'ACTIONS' && <ModalOtherActions />}
         {modals.modalOther.header === 'EFFECTS' && <ModalOtherEffects />}
      </>
   )
}

export default ModalOtherData
