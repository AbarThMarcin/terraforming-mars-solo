import { INIT_ANIMATION_DATA } from './initAnimation'

export const INIT_MODALS = {
   // If a card has been played
   cardPlayed: false,
   // Which modal to show
   cardWithAction: false,
   cardViewOnly: false,
   cards: false, // Cards In Hand or Cards Played
   sellCards: false,
   marsUniversity: false,
   businessContacts: false,
   corp: false,
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
      cards: [],
      selectCount: null,
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
