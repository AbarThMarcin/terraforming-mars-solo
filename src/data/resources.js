import resMln from '../assets/images/resources/mln.png'
import resSteel from '../assets/images/resources/steel.jpg'
import resTitan from '../assets/images/resources/titan.jpg'
import resPlant from '../assets/images/resources/plant.jpg'
import resEnergy from '../assets/images/resources/energy.png'
import resHeat from '../assets/images/resources/heat.png'
import resCard from '../assets/images/resources/card.png'
import resMicrobe from '../assets/images/resources/microbe.png'
import resAnimal from '../assets/images/resources/animal.png'
import resScience from '../assets/images/resources/science.png'
import resFighter from '../assets/images/resources/fighter.png'
import resTr from '../assets/images/resources/tr.png'
import resProdBg from '../assets/images/resources/prodBg.png'

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
