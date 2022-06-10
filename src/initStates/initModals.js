export const INIT_ANIMATION_DATA = {
   resourcesIn: {
      type: null,
      value: null,
   },
   resourcesOut: {
      type: null,
      value: null,
   },
   productionIn: {
      type: null,
      value: null,
   },
   productionOut: {
      type: null,
      value: null,
   },
   cardIn: {
      type: null,
      value: null,
   },
   cardOut: {
      type: null,
      value: null,
   },
}

export const INIT_MODALS = {
   // Which modal to show
   cardWithAction: false,
   cardViewOnly: false,
   cards: false, // Cards In Hand or Cards Played
   draft: false,
   sellCards: false,
   marsUniversity: false,
   businessContacts: false,
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
   production: false, // Card Robotic Workforce only
   selectOne: false,
   selectCard: false,
   animation: false,
   panelCorp: true,
   panelStateGame: true,
   endStats: false,
   // Info for business contacts or invention contest
   modalBusCont: {
      cardsCount: null,
      selectCount: null
   },
   // Info for cards modal
   modalCard: null,
   modalCards: [],
   modalCardsType: null,
   // Info for selectOne modal
   modalSelectOne: {
      card: null,
      options: [],
   },
   // Info for selectCard modal
   modalSelectCard: {
      cardIdAction: null,
      card: null,
      func: null,
   },
   // Info for modal other
   modalOther: {
      header: null,
      amount: null,
      data: [],
   },
   // Info for modal resource
   modalResource: {
      cardId: null,
      amount: null,
      data: [],
      resType: null,
   },
   // Info for modal production
   modalProduction: {
      cardIdOrCorpName: null,
      data: [],
      immProdEffects: [],
      miningRights: [],
      miningArea: [],
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
