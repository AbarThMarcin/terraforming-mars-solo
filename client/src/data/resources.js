import resMln from '../assets/images/resources/mln.svg'
import resSteel from '../assets/images/resources/steel.svg'
import resTitan from '../assets/images/resources/titan.svg'
import resPlant from '../assets/images/resources/plant.svg'
import resEnergy from '../assets/images/resources/energy.svg'
import resHeat from '../assets/images/resources/heat.svg'
import resCard from '../assets/images/resources/card.png'
import resMicrobe from '../assets/images/resources/microbe.svg'
import resAnimal from '../assets/images/resources/animal.svg'
import resScience from '../assets/images/resources/science.svg'
import resFighter from '../assets/images/resources/fighter.svg'
import resTr from '../assets/images/resources/tr.svg'
import resProdBg from '../assets/images/resources/prodBg.svg'

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
