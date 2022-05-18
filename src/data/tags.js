import buildingTag from '../assets/images/tags/building.jpg'
import spaceTag from '../assets/images/tags/space.jpg'
import powerTag from '../assets/images/tags/power.jpg'
import scienceTag from '../assets/images/tags/science.jpg'
import jovianTag from '../assets/images/tags/jovian.jpg'
import earthTag from '../assets/images/tags/earth.jpg'
import plantTag from '../assets/images/tags/plant.jpg'
import microbeTag from '../assets/images/tags/microbe.jpg'
import animalTag from '../assets/images/tags/animal.jpg'
import cityTag from '../assets/images/tags/city.jpg'
import eventTag from '../assets/images/tags/event.jpg'

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
