import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../../game'
import { SoundContext } from '../../../../App'
import { CORP_NAMES } from '../../../../data/corpNames'
import iconCredicor from '../../../../assets/images/corps/cards/card_credicor.png'
import iconEcoline from '../../../../assets/images/corps/cards/card_ecoline.png'
import iconHelion from '../../../../assets/images/corps/cards/card_helion.png'
import iconInterplanetary from '../../../../assets/images/corps/cards/card_interplanetary.png'
import iconInventrix from '../../../../assets/images/corps/cards/card_inventrix.png'
import iconMiningGuild from '../../../../assets/images/corps/cards/card_miningGuild.png'
import iconPhobolog from '../../../../assets/images/corps/cards/card_phobolog.png'
import iconSaturnSystems from '../../../../assets/images/corps/cards/card_saturnSystems.png'
import iconTeractor from '../../../../assets/images/corps/cards/card_teractor.png'
import iconTharsis from '../../../../assets/images/corps/cards/card_tharsis.png'
import iconThorgate from '../../../../assets/images/corps/cards/card_thorgate.png'
import iconUnmi from '../../../../assets/images/corps/cards/card_unmi.png'

const Corp = ({ corp, selectedCorp, setSelectedCorp, id }) => {
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const handleCorpClick = (e) => {
      e.stopPropagation()
      if (!stateGame.phaseCorporation) return
      sound.btnGeneralClick.play()
      setSelectedCorp(id)
   }

   return (
      <div
         className={`
            corp
            ${selectedCorp === id && selectedCorp !== undefined && 'selected'}
            ${modals.corps && 'pointer'}
         `}
         onClick={handleCorpClick}
      >
         {corp.name === CORP_NAMES.CREDICOR && <img src={iconCredicor} alt="credicor_icon" />}
         {corp.name === CORP_NAMES.ECOLINE && <img src={iconEcoline} alt="ecoline_icon" />}
         {corp.name === CORP_NAMES.HELION && <img src={iconHelion} alt="helion_icon" />}
         {corp.name === CORP_NAMES.INTERPLANETARY && <img src={iconInterplanetary} alt="interplanetary_icon" />}
         {corp.name === CORP_NAMES.INVENTRIX && <img src={iconInventrix} alt="inventrix_icon" />}
         {corp.name === CORP_NAMES.MINING_GUILD && <img src={iconMiningGuild} alt="miningGuild_icon" />}
         {corp.name === CORP_NAMES.PHOBOLOG && <img src={iconPhobolog} alt="phobolog_icon" />}
         {corp.name === CORP_NAMES.SATURN_SYSTEMS && <img src={iconSaturnSystems} alt="saturnSystems_icon" />}
         {corp.name === CORP_NAMES.TERACTOR && <img src={iconTeractor} alt="teractor_icon" />}
         {corp.name === CORP_NAMES.THARSIS_REPUBLIC && <img src={iconTharsis} alt="tharsis_icon" />}
         {corp.name === CORP_NAMES.THORGATE && <img src={iconThorgate} alt="thorgate_icon" />}
         {corp.name === CORP_NAMES.UNMI && <img src={iconUnmi} alt="unmi_icon" />}
      </div>
   )
}

export default Corp
