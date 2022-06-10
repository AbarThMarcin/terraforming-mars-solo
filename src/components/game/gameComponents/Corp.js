import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../Game'
import { CORP_NAMES } from '../../../data/corpNames'
import iconCredicor from '../../../assets/images/corps/cards/credicor.png'
import iconEcoline from '../../../assets/images/corps/cards/ecoline.png'
import iconHelion from '../../../assets/images/corps/cards/helion.png'
import iconInterplanetary from '../../../assets/images/corps/cards/interplanetary.png'
import iconInventrix from '../../../assets/images/corps/cards/inventrix.png'
import iconMiningGuild from '../../../assets/images/corps/cards/miningGuild.png'
import iconPhobolog from '../../../assets/images/corps/cards/phobolog.png'
import iconSaturnSystems from '../../../assets/images/corps/cards/saturnSystems.png'
import iconTeractor from '../../../assets/images/corps/cards/teractor.png'
import iconTharsis from '../../../assets/images/corps/cards/tharsis.png'
import iconThorgate from '../../../assets/images/corps/cards/thorgate.png'
import iconUnmi from '../../../assets/images/corps/cards/unmi.png'

const Corp = ({ corp, selectedCorp, setSelectedCorp, id }) => {
   const { stateGame } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)

   const handleCorpClick = (e) => {
      e.stopPropagation()
      if (!stateGame.phaseCorporation) return
      setSelectedCorp(id)
   }

   return (
      <div
         className={`
            corp
            ${modals.corp && 'modal center'}
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
