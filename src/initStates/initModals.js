export const INIT_ANIMATION_DATA = {
   resourcesIn: {
      type: null,
      value: 0,
   },
   resourcesOut: {
      type: null,
      value: 0,
   },
   productionIn: {
      type: null,
      value: 0,
   },
   productionOut: {
      type: null,
      value: 0,
   },
   cardIn: {
      type: null,
      value: 0,
   },
   cardOut: {
      type: null,
      value: 0,
   },
}

export const INIT_MODALS = {
   // Which modal to show
   cardWithAction: false,
   cardViewOnly: false,
   cards: false, // Cards In Hand or Cards Played
   draft: false,
   sellCards: false,
   corp: false,
   corps: true,
   log: false,
   menu: false,
   settings: false,
   rules: false,
   other: false,
   standardProjects: false,
   confirmation: false,
   resource: false,
   selectOne: false,
   animation: false,
   // Which cards to show in cards modal
   modalCard: null,
   modalCards: [],
   modalCardsType: null,
   // Which card to show in selectOne modal
   modalSelectOne: {
      card: null
   },
   // Info for modal other
   modalOther: {
      header: null,
      amount: 0,
      data: [],
   },
   // Info for modal resource
   modalResource: {
      amount: 0,
      data: [],
   },
   // Info for confirmation modal
   modalConf: {
      text: null,
      onYes: null,
      onNo: null,
   },
   // Info for animations
   animationData: INIT_ANIMATION_DATA,
}
