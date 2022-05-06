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
   temperature: {
      type: null,
      value: 0,
   },
   oxygen: {
      type: null,
      value: 0,
   },
   oceans: {
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
   animation: false,
   // Which cards to show in cards modal
   modalCard: null,
   modalCards: [],
   modalCardsType: null,
   // Info for modal other
   modalOther: {
      header: null,
      amount: 0,
      data: [],
   },
   // Data for confirmation modal
   modalConfData: {
      text: null,
      onYes: null,
      onNo: null,
   },
   // Data for animations
   animationData: INIT_ANIMATION_DATA
}