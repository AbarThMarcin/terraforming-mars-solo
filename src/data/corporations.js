import { EFFECTS } from './effects'
import { RESOURCES } from './resources'
import { TAGS } from './tags'

export const CORPORATIONS = [
   // {
   //    id: 1,
   //    name: 'Credicor',
   //    description: 'Credicor',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       resources: { mln: 57, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [EFFECTS.EFFECT_CREDICOR],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 2,
   //    name: 'Ecoline',
   //    description: 'Ecoline',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plant: 2, energy: 0, heat: 0 },
   //       resources: { mln: 36, steel: 0, titan: 0, plant: 7, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [EFFECTS.EFFECT_ECOLINE, EFFECTS.EFFECT_RESEARCH_OUTPOST, EFFECTS.EFFECT_EARTH_OFFICE],
   //    tags: [RESOURCES.PLANT],
   //    logo: {
   //       url: '',
   //    },
   // },
   {
      id: 3,
      name: 'Helion',
      description: 'Helion',
      startingConditions: {
         production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 3 },
         resources: { mln: 25, steel: 2, titan: 2, plant: 7, energy: 4, heat: 2 },
         action: null,
      },
      effects: [
         EFFECTS.EFFECT_HELION,
         EFFECTS.EFFECT_ARCTIC_ALGAE,
         EFFECTS.EFFECT_STANDARD_TECHNOLOGY,
      ],
      tags: [TAGS.SPACE],
      logo: {
         url: '',
      },
   },
   // {
   //    id: 4,
   //    name: 'Interplanetary Cinematics',
   //    description: 'Interplanetary Cinematics',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       resources: { mln: 30, steel: 20, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [EFFECTS.EFFECT_INTERPLANETARY],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 5,
   //    name: 'Inventrix',
   //    description: 'Inventrix',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       resources: { mln: 45, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [EFFECTS.EFFECT_INVENTRIX],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 6,
   //    name: 'Mining Guild',
   //    description: 'Mining Guild',
   //    startingConditions: {
   //       production: { mln: 0, steel: 1, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       resources: { mln: 30, steel: 5, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [], // DO NOT PUT EFFECTS.EFFECT_MINING_GUILD HERE
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 7,
   //    name: 'Phobolog',
   //    description: 'Phobolog',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       resources: { mln: 23, steel: 2, titan: 10, plant: 0, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [],
   //    tags: [TAGS.SPACE],
   //    logo: {
   //       url: '',
   //    },
   // },
   {
      id: 8,
      name: 'Saturn Systems',
      description: 'Saturn Systems',
      startingConditions: {
         production: { mln: 1, steel: 0, titan: 1, plant: 0, energy: 1, heat: 0 },
         resources: { mln: 42, steel: 0, titan: 3, plant: 0, energy: 0, heat: 0 },
         action: null,
      },
      effects: [EFFECTS.EFFECT_SATURN_SYSTEMS],
      tags: [TAGS.JOVIAN],
      logo: {
         url: '',
      },
   },
   // {
   //    id: 9,
   //    name: 'Teractor',
   //    description: 'Teractor',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       resources: { mln: 60, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 10,
   //    name: 'Tharsis Republic',
   //    description: 'Tharsis Republic',
   //    startingConditions: {
   //       production: { mln: 2, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       resources: { mln: 40, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 11,
   //    name: 'Thorgate',
   //    description: 'Thorgate',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 1, heat: 0 },
   //       resources: { mln: 48, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 12,
   //    name: 'UNMI',
   //    description: 'UNMI',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       resources: { mln: 40, steel: 0, titan: 0, plant: 0, energy: 0, heat: 0 },
   //       action: null,
   //    },
   //    effects: [],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   //    actionUsed: false,
   //    trRaised: false
   // },
]
