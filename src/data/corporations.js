import { EFFECTS } from './effects'
import { TAGS } from './tags'
import { CORP_NAMES } from './corpNames'
import logoCredicor from '../assets/images/corporation-logos/Card/credicor.png'
import logoEcoline from '../assets/images/corporation-logos/Card/ecoline.png'
import logoHelion from '../assets/images/corporation-logos/Card/helion.png'
import logoInterplanetary from '../assets/images/corporation-logos/Card/interplanetary.png'
import logoInventrix from '../assets/images/corporation-logos/Card/inventrix.png'
import logoMiningGuild from '../assets/images/corporation-logos/Card/miningGuild.png'
import logoPhobolog from '../assets/images/corporation-logos/Card/phobolog.png'
import logoSaturnSystems from '../assets/images/corporation-logos/Card/saturnSystems.png'
import logoTeractor from '../assets/images/corporation-logos/Card/teractor.png'
import logoTharsis from '../assets/images/corporation-logos/Card/tharsis.png'
import logoThorgate from '../assets/images/corporation-logos/Card/thorgate.png'
import logoUnmi from '../assets/images/corporation-logos/Card/unmi.png'
import logoMiniCredicor from '../assets/images/corporation-logos/PassContainer/credicor.svg'
import logoMiniEcoline from '../assets/images/corporation-logos/PassContainer/ecoline.svg'
import logoMiniHelion from '../assets/images/corporation-logos/PassContainer/helion.svg'
import logoMiniInterplanetary from '../assets/images/corporation-logos/PassContainer/interplanetary.svg'
import logoMiniInventrix from '../assets/images/corporation-logos/PassContainer/inventrix.svg'
import logoMiniMiningGuild from '../assets/images/corporation-logos/PassContainer/miningGuild.svg'
import logoMiniPhobolog from '../assets/images/corporation-logos/PassContainer/phobolog.svg'
import logoMiniSaturnSystems from '../assets/images/corporation-logos/PassContainer/saturnSystems.svg'
import logoMiniTeractor from '../assets/images/corporation-logos/PassContainer/teractor.svg'
import logoMiniTharsis from '../assets/images/corporation-logos/PassContainer/tharsis.svg'
import logoMiniThorgate from '../assets/images/corporation-logos/PassContainer/thorgate.svg'
import logoMiniUnmi from '../assets/images/corporation-logos/PassContainer/unmi.svg'

// Corporation names
export const getCorpLogo = (corpName) => {
   switch (corpName) {
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
export const getCorpLogoMini = (corpName) => {
   switch (corpName) {
      case CORP_NAMES.CREDICOR:
         return logoMiniCredicor
      case CORP_NAMES.ECOLINE:
         return logoMiniEcoline
      case CORP_NAMES.HELION:
         return logoMiniHelion
      case CORP_NAMES.INTERPLANETARY:
         return logoMiniInterplanetary
      case CORP_NAMES.INVENTRIX:
         return logoMiniInventrix
      case CORP_NAMES.MINING_GUILD:
         return logoMiniMiningGuild
      case CORP_NAMES.PHOBOLOG:
         return logoMiniPhobolog
      case CORP_NAMES.SATURN_SYSTEMS:
         return logoMiniSaturnSystems
      case CORP_NAMES.TERACTOR:
         return logoMiniTeractor
      case CORP_NAMES.THARSIS_REPUBLIC:
         return logoMiniTharsis
      case CORP_NAMES.THORGATE:
         return logoMiniThorgate
      case CORP_NAMES.UNMI:
         return logoMiniUnmi
      default:
         return
   }
}

export const CORPORATIONS = [
   // {
   //    id: 1,
   //    name: CORP_NAMES.CREDICOR,
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 57, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_CREDICOR],
   //    tags: [],
   // },
   {
      id: 2,
      name: CORP_NAMES.ECOLINE,
      production: { mln: 0, steel: 0, titan: 0, plant: 2, energy: 0, heat: 0 },
      resources: { mln: 36, steel: 0, titan: 0, plant: 3, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_ECOLINE],
      tags: [TAGS.PLANT],
   },
   {
      id: 3,
      name: CORP_NAMES.HELION,
      production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 3 },
      resources: { mln: 42, steel: 0, titan: 0, plant: 0, energy: 0, heat: 3 },
      effects: [EFFECTS.EFFECT_HELION],
      tags: [TAGS.SPACE],
   },
   // {
   //    id: 4,
   //    name: CORP_NAMES.INTERPLANETARY,
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 30, steel: 20, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_INTERPLANETARY],
   //    tags: [TAGS.BUILDING],
   // },
   // {
   //    id: 5,
   //    name: CORP_NAMES.INVENTRIX,
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 45, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_INVENTRIX],
   //    tags: [TAGS.SCIENCE],
   // },
   // {
   //    id: 6,
   //    name: CORP_NAMES.MINING_GUILD,
   //    production: { mln: 0, steel: 1, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 30, steel: 5, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_MINING_GUILD],
   //    tags: [TAGS.BUILDING, TAGS.BUILDING],
   // },
   // {
   //    id: 7,
   //    name: CORP_NAMES.PHOBOLOG,
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 23, steel: 0, titan: 10, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_PHOBOLOG],
   //    tags: [TAGS.SPACE],
   // },
   // {
   //    id: 8,
   //    name: CORP_NAMES.SATURN_SYSTEMS,
   //    production: { mln: 1, steel: 0, titan: 1, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 42, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_SATURN_SYSTEMS],
   //    tags: [TAGS.JOVIAN],
   // },
   // {
   //    id: 9,
   //    name: CORP_NAMES.TERACTOR,
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 60, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_TERACTOR],
   //    tags: [TAGS.EARTH],
   // },
   // {
   //    id: 10,
   //    name: CORP_NAMES.THARSIS_REPUBLIC,
   //    production: { mln: 2, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 40, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_THARSIS_CITY_ONPLANET, EFFECTS.EFFECT_THARSIS_CITY],
   //    tags: [TAGS.BUILDING],
   // },
   // {
   //    id: 11,
   //    name: CORP_NAMES.THORGATE,
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 1, heat: 0 },
   //    resources: { mln: 48, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [EFFECTS.EFFECT_THORGATE],
   //    tags: [TAGS.POWER],
   // },
   // {
   //    id: 12,
   //    name: CORP_NAMES.UNMI,
   //    production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    resources: { mln: 40, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //    effects: [],
   //    tags: [TAGS.EARTH],
   //    actionUsed: false,
   //    trRaised: false,
   // },
]
