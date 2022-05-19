import { EFFECTS } from './effects'
import { TAGS } from './tags'
import { CORP_NAMES } from './corpNames'
import logoCredicor from '../assets/images/corporation-logos/logoCredicor.png'
import logoEcoline from '../assets/images/corporation-logos/logoEcoline.png'
import logoHelion from '../assets/images/corporation-logos/logoHelion.png'
import logoInterplanetary from '../assets/images/corporation-logos/logoInterplanetary.png'
import logoInventrix from '../assets/images/corporation-logos/logoInventrix.png'
import logoMiningGuild from '../assets/images/corporation-logos/logoMiningGuild.png'
import logoPhobolog from '../assets/images/corporation-logos/logoPhobolog.png'
import logoSaturnSystems from '../assets/images/corporation-logos/logoSaturnSystems.png'
import logoTeractor from '../assets/images/corporation-logos/logoTeractor.png'
import logoTharsis from '../assets/images/corporation-logos/logoTharsis.png'
import logoThorgate from '../assets/images/corporation-logos/logoThorgate.png'
import logoUnmi from '../assets/images/corporation-logos/logoUnmi.png'

// Corporation names
export const getCorpLogo = (corporation) => {
   switch (corporation) {
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

export const CORPORATIONS = [
   // {
   //    id: 1,
   //    name: CORP_NAMES.CREDICOR,
   //    description: 'Credicor',
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 57, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_CREDICOR],
   //    tags: [],
   // },
   {
      id: 2,
      name: CORP_NAMES.ECOLINE,
      description: 'Ecoline',
      production: { mln: 0, steel: 0, titan: 0, plant: 2, energy: 0, heat: 0 },
      resources: { mln: 100, steel: 0, titan: 0, plant: 3, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_ECOLINE],
      tags: [TAGS.PLANT],
   },
   // {
   //    id: 3,
   //    name: CORP_NAMES.HELION,
   //    description: 'Helion',
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 3 },
   //    resources: { mln: 42, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_HELION],
   //    tags: [TAGS.SPACE],
   // },
   // {
   //    id: 4,
   //    name: CORP_NAMES.INTERPLANETARY,
   //    description: 'Interplanetary Cinematics',
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 30, steel: 20, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_INTERPLANETARY],
   //    tags: [TAGS.BUILDING],
   // },
   // {
   //    id: 5,
   //    name: CORP_NAMES.INVENTRIX,
   //    description: 'Inventrix',
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 45, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_INVENTRIX],
   //    tags: [TAGS.SCIENCE],
   // },
   {
      id: 6,
      name: CORP_NAMES.MINING_GUILD,
      description: 'Mining Guild',
      production: { mln: 0, steel: 1, titan: 0, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 30, steel: 5, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_MINING_GUILD],
      tags: [TAGS.BUILDING, TAGS.BUILDING],
   },
   // {
   //    id: 7,
   //    name: CORP_NAMES.PHOBOLOG,
   //    description: 'Phobolog',
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 23, steel: 0, titan: 10, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_PHOBOLOG],
   //    tags: [TAGS.SPACE],
   // },
   // {
   //    id: 8,
   //    name: CORP_NAMES.SATURN_SYSTEMS,
   //    description: 'Saturn Systems',
   //    production: { mln: 1, steel: 0, titan: 1, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 42, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_SATURN_SYSTEMS],
   //    tags: [TAGS.JOVIAN],
   // },
   // {
   //    id: 9,
   //    name: CORP_NAMES.TERACTOR,
   //    description: 'Teractor',
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 60, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_TERACTOR],
   //    tags: [TAGS.EARTH],
   // },
   // {
   //    id: 10,
   //    name: CORP_NAMES.THARSIS_REPUBLIC,
   //    description: 'Tharsis Republic',
   //    production: { mln: 2, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 40, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_THARSIS_CITY_ONPLANET, EFFECTS.EFFECT_THARSIS_CITY],
   //    tags: [TAGS.BUILDING],
   // },
   // {
   //    id: 11,
   //    name: CORP_NAMES.THORGATE,
   //    description: 'Thorgate',
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 1, heat: 0 },
   //    resources: { mln: 48, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_THORGATE],
   //    tags: [TAGS.POWER],
   // },
   // {
   //    id: 12,
   //    name: CORP_NAMES.UNMI,
   //    description: 'UNMI',
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 40, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [],
   //    tags: [TAGS.EARTH],
   //    actionUsed: false,
   //    trRaised: false,
   // },
]
