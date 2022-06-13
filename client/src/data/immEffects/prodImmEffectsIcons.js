import _energy from '../../assets/images/prodImmEffects/_energy.svg'
import _energy_mln2 from '../../assets/images/prodImmEffects/_energy_mln2.svg'
import _energy2mln5 from '../../assets/images/prodImmEffects/_energy2mln5.svg'
import _energy2plant from '../../assets/images/prodImmEffects/_energy2plant.svg'
import _energy2steel2 from '../../assets/images/prodImmEffects/_energy2steel2.svg'
import _energy2steel2titan from '../../assets/images/prodImmEffects/_energy2steel2titan.svg'
import _energy4plant2 from '../../assets/images/prodImmEffects/_energy4plant2.svg'
import _energyheat3 from '../../assets/images/prodImmEffects/_energyheat3.svg'
import _energyheat4 from '../../assets/images/prodImmEffects/_energyheat4.svg'
import _energymln2 from '../../assets/images/prodImmEffects/_energymln2.svg'
import _energymln3 from '../../assets/images/prodImmEffects/_energymln3.svg'
import _energymln4 from '../../assets/images/prodImmEffects/_energymln4.svg'
import _energyplant from '../../assets/images/prodImmEffects/_energyplant.svg'
import _energysteel2 from '../../assets/images/prodImmEffects/_energysteel2.svg'
import _energytitanmln from '../../assets/images/prodImmEffects/_energytitanmln.svg'
import _heat2mln3 from '../../assets/images/prodImmEffects/_heat2mln3.svg'
import _heatany2energy from '../../assets/images/prodImmEffects/_heatany2energy.svg'
import _mln2energy3 from '../../assets/images/prodImmEffects/_mln2energy3.svg'
import _mlnenergy from '../../assets/images/prodImmEffects/_mlnenergy.svg'
import _mlnenergy2 from '../../assets/images/prodImmEffects/_mlnenergy2.svg'
import _plantanyenergy2 from '../../assets/images/prodImmEffects/_plantanyenergy2.svg'
import _plantmln4 from '../../assets/images/prodImmEffects/_plantmln4.svg'
import energy from '../../assets/images/prodImmEffects/energy.svg'
import energy2 from '../../assets/images/prodImmEffects/energy2.svg'
import energy3 from '../../assets/images/prodImmEffects/energy3.svg'
import energysteel from '../../assets/images/prodImmEffects/energysteel.svg'
import heat4 from '../../assets/images/prodImmEffects/heat4.svg'
import mln from '../../assets/images/prodImmEffects/mln.svg'
import mln2 from '../../assets/images/prodImmEffects/mln2.svg'
import mlnper2buildings from '../../assets/images/prodImmEffects/mlnper2buildings.svg'
import steel from '../../assets/images/prodImmEffects/steel.svg'
import titan from '../../assets/images/prodImmEffects/titan.svg'

import { CORP_NAMES } from '../corpNames'
import { RESOURCES } from '../resources'

export const getProdImmEffectIcon = (cardIdOrCorpName, modals) => {
   switch (cardIdOrCorpName) {
      case CORP_NAMES.MINING_GUILD:
      case 56:
         return steel
      case 3:
      case 113:
      case 141:
      case 168:
         return energy
      case 8:
         return _energy2mln5
      case 13:
      case 144:
         return titan
      case 16:
      case 17:
      case 29:
      case 182:
         return _energymln3
      case 26:
      case 174:
         return mln2
      case 32:
         return _energy2steel2
      case 41:
         return _plantmln4
      case 43:
         return _energyheat3
      case 44:
      case 176:
         return mln
      case 45:
         return _mln2energy3
      case 64:
         return modals.modalProduction.miningArea.type === RESOURCES.STEEL ? steel : titan
      case 65:
         return _energysteel2
      case 67:
         return modals.modalProduction.miningRights.type === RESOURCES.STEEL ? steel : titan
      case 69:
      case 205:
      case 208:
         return _energy
      case 85:
      case 108:
         return _energymln4
      case 89:
         return _mlnenergy2
      case 98:
         return _heat2mln3
      case 100:
         return _mlnenergy
      case 117:
      case 136:
         return energy2
      case 120:
         return _energymln2
      case 126:
         return _energyheat4
      case 132:
      case 145:
         return energy3
      case 138:
         return _energy2steel2titan
      case 142:
         return heat4
      case 158:
         return energysteel
      case 165:
         return _energy4plant2
      case 171:
         return _energy2plant
      case 178:
         return _heatany2energy
      case 179:
         return _energyplant
      case 180:
         return _energytitanmln
      case 183:
         return _plantanyenergy2
      case 200:
         return _energy_mln2
      case 207:
         return mlnper2buildings
      default:
         return
   }
}
