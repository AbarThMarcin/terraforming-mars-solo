import prodImmEffect__energy from '../../assets/images/prodImmEffects/prodImmEffect__energy.svg'
import prodImmEffect__energy_mln2 from '../../assets/images/prodImmEffects/prodImmEffect__energy_mln2.svg'
import prodImmEffect__energy2mln5 from '../../assets/images/prodImmEffects/prodImmEffect__energy2mln5.svg'
import prodImmEffect__energy2plant from '../../assets/images/prodImmEffects/prodImmEffect__energy2plant.svg'
import prodImmEffect__energy2steel2 from '../../assets/images/prodImmEffects/prodImmEffect__energy2steel2.svg'
import prodImmEffect__energy2steel2titan from '../../assets/images/prodImmEffects/prodImmEffect__energy2steel2titan.svg'
import prodImmEffect__energy4plant2 from '../../assets/images/prodImmEffects/prodImmEffect__energy4plant2.svg'
import prodImmEffect__energyheat3 from '../../assets/images/prodImmEffects/prodImmEffect__energyheat3.svg'
import prodImmEffect__energyheat4 from '../../assets/images/prodImmEffects/prodImmEffect__energyheat4.svg'
import prodImmEffect__energymln2 from '../../assets/images/prodImmEffects/prodImmEffect__energymln2.svg'
import prodImmEffect__energymln3 from '../../assets/images/prodImmEffects/prodImmEffect__energymln3.svg'
import prodImmEffect__energymln4 from '../../assets/images/prodImmEffects/prodImmEffect__energymln4.svg'
import prodImmEffect__energyplant from '../../assets/images/prodImmEffects/prodImmEffect__energyplant.svg'
import prodImmEffect__energysteel2 from '../../assets/images/prodImmEffects/prodImmEffect__energysteel2.svg'
import prodImmEffect__energytitanmln from '../../assets/images/prodImmEffects/prodImmEffect__energytitanmln.svg'
import prodImmEffect__heat2mln3 from '../../assets/images/prodImmEffects/prodImmEffect__heat2mln3.svg'
import prodImmEffect__heatany2energy from '../../assets/images/prodImmEffects/prodImmEffect__heatany2energy.svg'
import prodImmEffect__mln2energy3 from '../../assets/images/prodImmEffects/prodImmEffect__mln2energy3.svg'
import prodImmEffect__mlnenergy from '../../assets/images/prodImmEffects/prodImmEffect__mlnenergy.svg'
import prodImmEffect__mlnenergy2 from '../../assets/images/prodImmEffects/prodImmEffect__mlnenergy2.svg'
import prodImmEffect__plantanyenergy2 from '../../assets/images/prodImmEffects/prodImmEffect__plantanyenergy2.svg'
import prodImmEffect__plantmln4 from '../../assets/images/prodImmEffects/prodImmEffect__plantmln4.svg'
import prodImmEffect_energy from '../../assets/images/prodImmEffects/prodImmEffect_energy.svg'
import prodImmEffect_energy2 from '../../assets/images/prodImmEffects/prodImmEffect_energy2.svg'
import prodImmEffect_energy3 from '../../assets/images/prodImmEffects/prodImmEffect_energy3.svg'
import prodImmEffect_energysteel from '../../assets/images/prodImmEffects/prodImmEffect_energysteel.svg'
import prodImmEffect_heat4 from '../../assets/images/prodImmEffects/prodImmEffect_heat4.svg'
import prodImmEffect_mln from '../../assets/images/prodImmEffects/prodImmEffect_mln.svg'
import prodImmEffect_mln2 from '../../assets/images/prodImmEffects/prodImmEffect_mln2.svg'
import prodImmEffect_mlnper2buildings from '../../assets/images/prodImmEffects/prodImmEffect_mlnper2buildings.svg'
import prodImmEffect_steel from '../../assets/images/prodImmEffects/prodImmEffect_steel.svg'
import prodImmEffect_titan from '../../assets/images/prodImmEffects/prodImmEffect_titan.svg'

import { CORP_NAMES } from '../corpNames'
import { RESOURCES } from '../resources'

export const getProdImmEffectIcon = (cardIdOrCorpName, modals) => {
   switch (cardIdOrCorpName) {
      case CORP_NAMES.MINING_GUILD:
      case 56:
         return prodImmEffect_steel
      case 3:
      case 113:
      case 141:
      case 168:
         return prodImmEffect_energy
      case 8:
         return prodImmEffect__energy2mln5
      case 13:
      case 144:
         return prodImmEffect_titan
      case 16:
      case 17:
      case 29:
      case 182:
         return prodImmEffect__energymln3
      case 26:
      case 174:
         return prodImmEffect_mln2
      case 32:
         return prodImmEffect__energy2steel2
      case 41:
         return prodImmEffect__plantmln4
      case 43:
         return prodImmEffect__energyheat3
      case 44:
      case 176:
         return prodImmEffect_mln
      case 45:
         return prodImmEffect__mln2energy3
      case 64:
         return modals.modalProduction.miningArea.type === RESOURCES.STEEL ? prodImmEffect_steel : prodImmEffect_titan
      case 65:
         return prodImmEffect__energysteel2
      case 67:
         return modals.modalProduction.miningRights.type === RESOURCES.STEEL ? prodImmEffect_steel : prodImmEffect_titan
      case 69:
      case 205:
      case 208:
         return prodImmEffect__energy
      case 85:
      case 108:
         return prodImmEffect__energymln4
      case 89:
         return prodImmEffect__mlnenergy2
      case 98:
         return prodImmEffect__heat2mln3
      case 100:
         return prodImmEffect__mlnenergy
      case 117:
      case 136:
         return prodImmEffect_energy2
      case 120:
         return prodImmEffect__energymln2
      case 126:
         return prodImmEffect__energyheat4
      case 132:
      case 145:
         return prodImmEffect_energy3
      case 138:
         return prodImmEffect__energy2steel2titan
      case 142:
         return prodImmEffect_heat4
      case 158:
         return prodImmEffect_energysteel
      case 165:
         return prodImmEffect__energy4plant2
      case 171:
         return prodImmEffect__energy2plant
      case 178:
         return prodImmEffect__heatany2energy
      case 179:
         return prodImmEffect__energyplant
      case 180:
         return prodImmEffect__energytitanmln
      case 183:
         return prodImmEffect__plantanyenergy2
      case 200:
         return prodImmEffect__energy_mln2
      case 207:
         return prodImmEffect_mlnper2buildings
      default:
         return
   }
}
