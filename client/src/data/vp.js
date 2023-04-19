import vp_1 from '../assets/images/vp/vp_vp_1.svg'
import vp_2 from '../assets/images/vp/vp_vp_2.svg'
import vp1 from '../assets/images/vp/vp_vp1.svg'
import vp2 from '../assets/images/vp/vp_vp2.svg'
import vp3 from '../assets/images/vp/vp_vp3.svg'
import vp4 from '../assets/images/vp/vp_vp4.svg'
import vp1per1animal from '../assets/images/vp/vp_vp1per1animal.svg'
import vp1per1city from '../assets/images/vp/vp_vp1per1city.svg'
import vp1per1fighter from '../assets/images/vp/vp_vp1per1fighter.svg'
import vp1per1jovian from '../assets/images/vp/vp_vp1per1jovian.svg'
import vp1per1ocean from '../assets/images/vp/vp_vp1per1ocean.svg'
import vp1per2animals from '../assets/images/vp/vp_vp1per2animals.svg'
import vp1per2microbes from '../assets/images/vp/vp_vp1per2microbes.svg'
import vp1per3cities from '../assets/images/vp/vp_vp1per3cities.svg'
import vp1per3microbes from '../assets/images/vp/vp_vp1per3microbes.svg'
import vp1per4microbes from '../assets/images/vp/vp_vp1per4microbes.svg'
import vp2per1science from '../assets/images/vp/vp_vp2per1science.svg'
import vp3per1science from '../assets/images/vp/vp_vp3per1science.svg'

export const VP_ICONS = {
   VP_1: 'vp_1',
   VP_2: 'vp_2',
   VP1: 'vp1',
   VP2: 'vp2',
   VP3: 'vp3',
   VP4: 'vp4',
   VP1PER1ANIMAL: 'vp1per1animal',
   VP1PER1CITY: 'vp1per1city',
   VP1PER1FIGHTER: 'vp1per1fighter',
   VP1PER1JOVIAN: 'vp1per1jovian',
   VP1PER1OCEAN: 'vp1per1ocean',
   VP1PER2ANIMALS: 'vp1per2animals',
   VP1PER2MICROBES: 'vp1per2microbes',
   VP1PER3CITIES: 'vp1per3cities',
   VP1PER3MICROBES: 'vp1per3microbes',
   VP1PER4MICROBES: 'vp1per4microbes',
   VP2PER1SCIENCE: 'vp2per1science',
   VP3PER1SCIENCE: 'vp3per1science',
}

export const getVpIcon = (vpIcon) => {
   switch (vpIcon) {
      case VP_ICONS.VP_1:
         return vp_1
      case VP_ICONS.VP_2:
         return vp_2
      case VP_ICONS.VP1:
         return vp1
      case VP_ICONS.VP2:
         return vp2
      case VP_ICONS.VP3:
         return vp3
      case VP_ICONS.VP4:
         return vp4
      case VP_ICONS.VP1PER1ANIMAL:
         return vp1per1animal
      case VP_ICONS.VP1PER1CITY:
         return vp1per1city
      case VP_ICONS.VP1PER1FIGHTER:
         return vp1per1fighter
      case VP_ICONS.VP1PER1JOVIAN:
         return vp1per1jovian
      case VP_ICONS.VP1PER1OCEAN:
         return vp1per1ocean
      case VP_ICONS.VP1PER2ANIMALS:
         return vp1per2animals
      case VP_ICONS.VP1PER2MICROBES:
         return vp1per2microbes
      case VP_ICONS.VP1PER3CITIES:
         return vp1per3cities
      case VP_ICONS.VP1PER3MICROBES:
         return vp1per3microbes
      case VP_ICONS.VP1PER4MICROBES:
         return vp1per4microbes
      case VP_ICONS.VP2PER1SCIENCE:
         return vp2per1science
      case VP_ICONS.VP3PER1SCIENCE:
         return vp3per1science
      default:
         return
   }
}
