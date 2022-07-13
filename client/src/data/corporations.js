import logoMiniCredicor from '../assets/images/corps/passContainer/credicor.svg'
import logoMiniEcoline from '../assets/images/corps/passContainer/ecoline.svg'
import logoMiniHelion from '../assets/images/corps/passContainer/helion.svg'
import logoMiniInterplanetary from '../assets/images/corps/passContainer/interplanetary.svg'
import logoMiniInventrix from '../assets/images/corps/passContainer/inventrix.svg'
import logoMiniMiningGuild from '../assets/images/corps/passContainer/miningGuild.svg'
import logoMiniPhobolog from '../assets/images/corps/passContainer/phobolog.svg'
import logoMiniSaturnSystems from '../assets/images/corps/passContainer/saturnSystems.svg'
import logoMiniTeractor from '../assets/images/corps/passContainer/teractor.svg'
import logoMiniTharsis from '../assets/images/corps/passContainer/tharsis.svg'
import logoMiniThorgate from '../assets/images/corps/passContainer/thorgate.svg'
import logoMiniUnmi from '../assets/images/corps/passContainer/unmi.svg'
import { CORP_NAMES } from './corpNames'
import { EFFECTS } from './effects'
import { TAGS } from './tags'

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
   {
      id: 1,
      name: CORP_NAMES.CREDICOR,
      production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 57, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_CREDICOR],
      tags: [],
   },
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
      resources: { mln: 42, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_HELION],
      tags: [TAGS.SPACE],
   },
   {
      id: 4,
      name: CORP_NAMES.INTERPLANETARY,
      production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 30, steel: 20, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_INTERPLANETARY],
      tags: [TAGS.BUILDING],
   },
   {
      id: 5,
      name: CORP_NAMES.INVENTRIX,
      production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 45, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_INVENTRIX],
      tags: [TAGS.SCIENCE],
   },
   {
      id: 6,
      name: CORP_NAMES.MINING_GUILD,
      production: { mln: 0, steel: 1, titan: 0, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 30, steel: 5, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_MINING_GUILD],
      tags: [TAGS.BUILDING, TAGS.BUILDING],
   },
   {
      id: 7,
      name: CORP_NAMES.PHOBOLOG,
      production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 23, steel: 0, titan: 10, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_PHOBOLOG],
      tags: [TAGS.SPACE],
   },
   {
      id: 8,
      name: CORP_NAMES.SATURN_SYSTEMS,
      production: { mln: 1, steel: 0, titan: 1, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 42, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_SATURN_SYSTEMS],
      tags: [TAGS.JOVIAN],
   },
   {
      id: 9,
      name: CORP_NAMES.TERACTOR,
      production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 60, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_TERACTOR],
      tags: [TAGS.EARTH],
   },
   {
      id: 10,
      name: CORP_NAMES.THARSIS_REPUBLIC,
      production: { mln: 2, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 40, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_THARSIS_CITY_ONPLANET, EFFECTS.EFFECT_THARSIS_CITY],
      tags: [TAGS.BUILDING],
   },
   {
      id: 11,
      name: CORP_NAMES.THORGATE,
      production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 1, heat: 0 },
      resources: { mln: 48, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [EFFECTS.EFFECT_THORGATE],
      tags: [TAGS.POWER],
   },
   {
      id: 12,
      name: CORP_NAMES.UNMI,
      production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      resources: { mln: 40, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
      effects: [],
      tags: [TAGS.EARTH],
      actionUsed: false,
      trRaised: false,
   },
]