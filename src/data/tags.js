import buildingTag from '../assets/images/tags/building.svg'
import spaceTag from '../assets/images/tags/space.svg'
import powerTag from '../assets/images/tags/power.svg'
import scienceTag from '../assets/images/tags/science.svg'
import jovianTag from '../assets/images/tags/jovian.svg'
import earthTag from '../assets/images/tags/earth.svg'
import plantTag from '../assets/images/tags/plant.svg'
import microbeTag from '../assets/images/tags/microbe.svg'
import animalTag from '../assets/images/tags/animal.svg'
import cityTag from '../assets/images/tags/city.svg'
import eventTag from '../assets/images/tags/event.svg'

export const TAGS = {
   BUILDING: 'building',
   SPACE: 'space',
   POWER: 'power',
   SCIENCE: 'science',
   JOVIAN: 'jovian',
   EARTH: 'earth',
   PLANT: 'plant',
   MICROBE: 'microbe',
   ANIMAL: 'animal',
   CITY: 'city',
   EVENT: 'event',
}

export const getTagIcon = (tagName) => {
   switch (tagName) {
      case TAGS.BUILDING:
         return buildingTag
      case TAGS.SPACE:
         return spaceTag
      case TAGS.POWER:
         return powerTag
      case TAGS.SCIENCE:
         return scienceTag
      case TAGS.JOVIAN:
         return jovianTag
      case TAGS.EARTH:
         return earthTag
      case TAGS.PLANT:
         return plantTag
      case TAGS.MICROBE:
         return microbeTag
      case TAGS.ANIMAL:
         return animalTag
      case TAGS.CITY:
         return cityTag
      case TAGS.EVENT:
         return eventTag
      default:
         break
   }
}
