import resMln from '../assets/images/resources/res_mln.svg'
import resSteel from '../assets/images/resources/res_steel.svg'
import resTitan from '../assets/images/resources/res_titan.svg'
import resPlant from '../assets/images/resources/res_plant.svg'
import resEnergy from '../assets/images/resources/res_energy.svg'
import resHeat from '../assets/images/resources/res_heat.svg'
import resCard from '../assets/images/resources/res_card.png'
import resMicrobe from '../assets/images/resources/res_microbe.svg'
import resAnimal from '../assets/images/resources/res_animal.svg'
import resScience from '../assets/images/resources/res_science.svg'
import resFighter from '../assets/images/resources/res_fighter.svg'
import resTr from '../assets/images/resources/res_tr.svg'
import resProdBg from '../assets/images/resources/res_prodBg.svg'

export const RESOURCES = {
   MLN: 'mln',
   STEEL: 'steel',
   TITAN: 'titan',
   PLANT: 'plant',
   ENERGY: 'energy',
   HEAT: 'heat',
   CARD: 'card',
   MICROBE: 'microbe',
   ANIMAL: 'animal',
   SCIENCE: 'science',
   FIGHTER: 'fighter',
   TR: 'tr',
   PROD_BG: 'prodBg',
}

export const getResIcon = (type) => {
   switch (type) {
      case RESOURCES.MLN:
         return resMln
      case RESOURCES.STEEL:
         return resSteel
      case RESOURCES.TITAN:
         return resTitan
      case RESOURCES.PLANT:
         return resPlant
      case RESOURCES.ENERGY:
         return resEnergy
      case RESOURCES.HEAT:
         return resHeat
      case RESOURCES.CARD:
         return resCard
      case RESOURCES.MICROBE:
         return resMicrobe
      case RESOURCES.ANIMAL:
         return resAnimal
      case RESOURCES.SCIENCE:
         return resScience
      case RESOURCES.FIGHTER:
         return resFighter
      case RESOURCES.TR:
         return resTr
      case RESOURCES.PROD_BG:
         return resProdBg
      default:
         return
   }
}
