import immEffect_steel1 from '../../assets/images/immEffects/immEffect_steel1.png'
import immEffect_titan1 from '../../assets/images/immEffects/immEffect_titan1.png'
import immEffect_peroxidePower from '../../assets/images/immEffects/immEffect_peroxidePower.png'
import immEffect_medicalLab from '../../assets/images/immEffects/immEffect_medicalLab.png'
import { CORP_NAMES } from '../corpNames'
import { RESOURCES } from '../resources'

export const getImmEffectIcon = (cardIdOrCorpName, modals) => {
   switch (cardIdOrCorpName) {
      case CORP_NAMES.MINING_GUILD:
         return immEffect_steel1
      case 64:
         return modals.modalProduction.miningArea.type === RESOURCES.STEEL
            ? immEffect_steel1
            : immEffect_titan1
      case 67:
         return modals.modalProduction.miningRights.type === RESOURCES.STEEL
            ? immEffect_steel1
            : immEffect_titan1
      case 89:
         return immEffect_peroxidePower
      case 207:
         return immEffect_medicalLab
      default:
         return
   }
}
