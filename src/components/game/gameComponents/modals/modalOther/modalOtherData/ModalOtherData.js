import { memo, useContext } from 'react'
import { ModalsContext } from '../../../../Game'
import ModalOtherDataRes from './ModalOtherDataRes'
import ModalOtherDataTags from './ModalOtherDataTags'
import ModalOtherDataVP from './ModalOtherDataVP'
import ModalOtherDataActions from './modalOtherDataActions/ModalOtherDataActions'
import ModalOtherDataEffects from './ModalOtherDataEffects'

const ModalOtherData = ({ setCardSnap, selectedCardId, setSelectedCardId }) => {
   const { modals } = useContext(ModalsContext)

   return (
      <>
         {modals.modalOther.header === 'CARD RESOURCES' && (
            <ModalOtherDataRes
               setCardSnap={setCardSnap}
               selectedCardId={selectedCardId}
               setSelectedCardId={setSelectedCardId}
            />
         )}
         {modals.modalOther.header === 'TAGS' && <ModalOtherDataTags />}
         {modals.modalOther.header === 'VP' && <ModalOtherDataVP setCardSnap={setCardSnap} />}
         {modals.modalOther.header === 'ACTIONS' && (
            <ModalOtherDataActions setCardSnap={setCardSnap} />
         )}
         {modals.modalOther.header === 'EFFECTS' && (
            <ModalOtherDataEffects setCardSnap={setCardSnap} />
         )}
      </>
   )
}

export default memo(ModalOtherData)
