const mongoose = require('mongoose')

const stateGameSchema = mongoose.Schema({
   generation: Number,
   phaseCorporation: Boolean,
   phaseDraft: Boolean,
   phaseViewGameState: Boolean,
   phasePlaceTile: Boolean,
   phasePlaceTileData: String,
   phaseAddRemoveRes: Boolean,
   phaseAfterGen14: Boolean,
   replayActionId: Number,
   globalParameters: {
      temperature: Number,
      oxygen: Number,
      oceans: Number,
   },
   tr: Number,
   SPCosts: {
      sellPatent: Number,
      powerPlant: {
         original: Number,
         current: Number,
      },
      asteroid: Number,
      aquifer: Number,
      greenery: Number,
      city: Number,
   },
   actionsLeft: [mongoose.Schema.Types.Mixed],
})

module.exports = { stateGameSchema }
