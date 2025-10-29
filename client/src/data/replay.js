import { INIT_REPLAY_DATA } from "../initStates/initReplayData"

export let replayData = INIT_REPLAY_DATA

export const resetReplayData = () => {
   replayData = JSON.parse(JSON.stringify(INIT_REPLAY_DATA))
}

export const REPLAY_USERINTERACTIONS = {
   BUSINESSCONTACTS: 'BUSINESSCONTACTS',
   MARSUNIVERSITY: 'MARSUNIVERSITY',
   PRODUCTION: 'PRODUCTION',
   RESOURCES: 'RESOURCES',
   SELECTCARD: 'SELECTCARD',
   SELECTONE: 'SELECTONE',
   PLACETILE: 'PLACETILE'
}