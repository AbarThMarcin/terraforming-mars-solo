// import { EFFECTS } from './effects'
export const CORPORATION_NAMES = {
   CREDICOR: 'Credicor',
   ECOLINE: 'Ecoline',
   HELION: 'Helion',
   INTERPLANETARY_CINEMATICS: 'Interplanetary Cinematics',
   INVENTRIX: 'Inventrix',
   MINING_GUILD: 'Mining Guild',
   PHOBOLOG: 'Phobolog',
   SATURN_SYSTEMS: 'Saturn Systems',
   TERACTOR: 'Teractor',
   THARSIS_REPUBLIC: 'Tharsis Republic',
   THORGATE: 'Thorgate',
   UNMI: 'UNMI',
}

export const EFFECTS_CORP = {
   // Corporation Effects
   CREDICOR_GAIN_4_RES_MLN: 'Gain 4M after playing card with 20+ mln base cost',
   ECOLINE_7_PLANTS_FOR_GREENERY: 'Pay 7 plants, instead of 8, to place 1 greenery',
   HELION_HEAT_INSTEAD_OF_MLN: 'Pay with heat instead of mln',
   INTERPLANETARY_GAIN_2_RES_MLN: 'Gain 2M after playing event card',
   INVENTRIX_PARAMETERS_REQUIREMENTS: 'Treat global parameters requirements as they are -2 or +2',
   SATURN_GAIN_1_PROD_MLN: 'Gain 1 mln production',
}

export const CORPORATIONS = [
   {
      id: 1,
      name: CORPORATION_NAMES.CREDICOR,
      description: 'Credicor',
      startingConditions: {
         production: { mln: 0, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
         resources: { mln: 57, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
         actions: [],
      },
      actions: [],
      effects: [
         {
            name: EFFECTS_CORP.CREDICOR_GAIN_4_RES_MLN,
            snapUrl: '',
         },
      ],
      tags: [],
      logo: {
         url: '',
      },
   },
   {
      id: 2,
      name: CORPORATION_NAMES.ECOLINE,
      description: 'Ecoline',
      startingConditions: {
         production: { mln: 0, steel: 0, titan: 0, plants: 2, power: 0, heat: 0 },
         resources: { mln: 36, steel: 0, titan: 0, plants: 7, power: 0, heat: 0 },
         actions: [],
      },
      actions: [],
      effects: [
         {
            name: EFFECTS_CORP.ECOLINE_7_PLANTS_FOR_GREENERY,
            snapUrl: '',
         },
      ],
      tags: ['plant'],
      logo: {
         url: '',
      },
   },
   {
      id: 3,
      name: CORPORATION_NAMES.HELION,
      description: 'Helion',
      startingConditions: {
         production: { mln: 0, steel: 0, titan: 0, plants: 0, power: 0, heat: 3 },
         resources: { mln: 42, steel: 0, titan: 0, plants: 7, power: 0, heat: 17 },
         actions: [],
      },
      actions: [],
      effects: [
         {
            name: EFFECTS_CORP.HELION_HEAT_INSTEAD_OF_MLN,
            snapUrl: '',
         },
      ],
      tags: [],
      logo: {
         url: '',
      },
   },
   // {
   //    id: 4,
   //    name: CORPORATION_NAMES.INTERPLANETARY_CINEMATICS,
   //    description: 'Interplanetary Cinematics',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       resources: { mln: 30, steel: 20, titan: 0, plants: 0, power: 0, heat: 0 },
   //       actions: [],
   //    },
   //    actions: [],
   //    effects: [
   //       {
   //          name: EFFECTS_CORP.INTERPLANETARY_GAIN_2_RES_MLN,
   //          snapUrl: '',
   //       },
   //    ],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 5,
   //    name: CORPORATION_NAMES.INVENTRIX,
   //    description: 'Inventrix',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       resources: { mln: 45, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       actions: [],
   //    },
   //    actions: [],
   //    effects: [
   //       {
   //          name: EFFECTS_CORP.INVENTRIX_PARAMETERS_REQUIREMENTS,
   //          snapUrl: '',
   //       },
   //    ],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 6,
   //    name: CORPORATION_NAMES.MINING_GUILD,
   //    description: 'Mining Guild',
   //    startingConditions: {
   //       production: { mln: 0, steel: 1, titan: 0, plants: 0, power: 0, heat: 0 },
   //       resources: { mln: 30, steel: 5, titan: 0, plants: 0, power: 0, heat: 0 },
   //       actions: [],
   //    },
   //    actions: [],
   //    effects: [],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 7,
   //    name: CORPORATION_NAMES.PHOBOLOG,
   //    description: 'Phobolog',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       resources: { mln: 23, steel: 2, titan: 10, plants: 0, power: 0, heat: 0 },
   //       actions: [],
   //    },
   //    actions: [],
   //    effects: [],
   //    tags: ['space'],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 8,
   //    name: CORPORATION_NAMES.SATURN_SYSTEMS,
   //    description: 'Saturn Systems',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 1, plants: 0, power: 0, heat: 0 },
   //       resources: { mln: 42, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       actions: [],
   //    },
   //    actions: [],
   //    effects: [
   //       {
   //          name: EFFECTS_CORP.SATURN_GAIN_1_PROD_MLN,
   //          snapUrl: '',
   //       },
   //    ],
   //    tags: ['jovian'],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 9,
   //    name: CORPORATION_NAMES.TERACTOR,
   //    description: 'Teractor',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       resources: { mln: 60, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       actions: [],
   //    },
   //    actions: [],
   //    effects: [],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 10,
   //    name: CORPORATION_NAMES.THARSIS_REPUBLIC,
   //    description: 'Tharsis Republic',
   //    startingConditions: {
   //       production: { mln: 2, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       resources: { mln: 40, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       actions: [],
   //    },
   //    actions: [],
   //    effects: [],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 11,
   //    name: CORPORATION_NAMES.THORGATE,
   //    description: 'Thorgate',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plants: 0, power: 1, heat: 0 },
   //       resources: { mln: 48, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       actions: [],
   //    },
   //    actions: [],
   //    effects: [],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
   // {
   //    id: 12,
   //    name: CORPORATION_NAMES.UNMI,
   //    description: 'UNMI',
   //    startingConditions: {
   //       production: { mln: 0, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       resources: { mln: 40, steel: 0, titan: 0, plants: 0, power: 0, heat: 0 },
   //       actions: [],
   //    },
   //    actions: [],
   //    effects: [],
   //    tags: [],
   //    logo: {
   //       url: '',
   //    },
   // },
]
