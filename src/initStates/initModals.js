export const INIT_MODALS = {
   // Which modal to show
   cardWithAction: false,
   cardViewOnly: false,
   cards: false,
   draft: false,
   corp: false,
   corps: true,
   log: false,
   menu: false,
   settings: false,
   rules: false,
   other: false,
   standardProjects: false,
   confirmation: false,
   // Which cards to show in cards modal
   modalCard: null,
   modalCards: [],
   modalCardsType: '',
   modalOther: null,
   // Data for confirmation modal
   modalConfData: {
      text: '',
      onYes: null,
      onNo: null,
   },
}
