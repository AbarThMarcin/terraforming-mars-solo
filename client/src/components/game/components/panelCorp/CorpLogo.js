import { useContext } from 'react'
import { ModalsContext, StatePlayerContext } from '../../../game'
import { SoundContext } from '../../../../App'
import { CORP_NAMES } from '../../../../data/corpNames'
import logoCredicor from '../../../../assets/images/corps/panelCorp/panelCorp_credicor.svg'
import logoEcoline from '../../../../assets/images/corps/panelCorp/panelCorp_ecoline.svg'
import logoHelion from '../../../../assets/images/corps/panelCorp/panelCorp_helion.svg'
import logoInterplanetary from '../../../../assets/images/corps/panelCorp/panelCorp_interplanetary.svg'
import logoInventrix from '../../../../assets/images/corps/panelCorp/panelCorp_inventrix.svg'
import logoMiningGuild from '../../../../assets/images/corps/panelCorp/panelCorp_miningGuild.svg'
import logoPhobolog from '../../../../assets/images/corps/panelCorp/panelCorp_phobolog.svg'
import logoSaturnSystems from '../../../../assets/images/corps/panelCorp/panelCorp_saturnSystems.svg'
import logoTeractor from '../../../../assets/images/corps/panelCorp/panelCorp_teractor.svg'
import logoTharsis from '../../../../assets/images/corps/panelCorp/panelCorp_tharsis.svg'
import logoThorgate from '../../../../assets/images/corps/panelCorp/panelCorp_thorgate.svg'
import logoUnmi from '../../../../assets/images/corps/panelCorp/panelCorp_unmi.svg'

const CorpLogo = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   const { setModals } = useContext(ModalsContext)
   const { sound } = useContext(SoundContext)

   const getLogo = () => {
      switch (statePlayer.corporation?.name) {
         case CORP_NAMES.CREDICOR:
            return logoCredicor
         case CORP_NAMES.ECOLINE:
            return logoEcoline
         case CORP_NAMES.HELION:
            return logoHelion
         case CORP_NAMES.INTERPLANETARY:
            return logoInterplanetary
         case CORP_NAMES.INVENTRIX:
            return logoInventrix
         case CORP_NAMES.MINING_GUILD:
            return logoMiningGuild
         case CORP_NAMES.PHOBOLOG:
            return logoPhobolog
         case CORP_NAMES.SATURN_SYSTEMS:
            return logoSaturnSystems
         case CORP_NAMES.TERACTOR:
            return logoTeractor
         case CORP_NAMES.THARSIS_REPUBLIC:
            return logoTharsis
         case CORP_NAMES.THORGATE:
            return logoThorgate
         case CORP_NAMES.UNMI:
            return logoUnmi
         default:
            return
      }
   }

   return (
      <div
         className="corp-logo pointer"
         onClick={() => {
            sound.btnCardsClick.play()
            setModals((prev) => ({ ...prev, corp: true }))
         }}
      >
         {statePlayer.corporation && <img src={getLogo()} alt={`logo_${statePlayer.corporation.name}`} />}
      </div>
   )
}

export default CorpLogo
