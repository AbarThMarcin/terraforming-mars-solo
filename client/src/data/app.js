export const INIT_SETTINGS = {
   speedId: 3,
   showTotVP: false,
   sortId: ['4a', '4a-played'],
   musicVolume: 0.3,
   gameVolume: 0.3,
}

export const SPEED = {
   SLOW: 2300,
   NORMAL: 1500,
   FAST: 1000,
   VERY_FAST: 600,
}

export const TABS = {
   GENERAL_STATISTICS: 'General Statistics',
   GENERAL_ACHIEVEMENTS: 'General Achievements',
   PLAYER_OVERVIEW: 'Player Overview',
   STATS_CARDS: 'Player Details',
   STATS_OTHER: 'Player Cards',
   GAMES: 'Games',
   GAMES_LOG: 'Games Log',
   RANKING_PRIMARY: 'Ranking Primary',
   RANKING_SECONDARY: 'Ranking Secondary',
   RANKING_RULES: 'Ranking Rules',
}

export const APP_MESSAGES = {
   SUCCESS: 'CHANGES SAVED SUCCESSFULLY!',
   LOGGED_OUT: 'YOU HAVE LOGGED OUT SUCCESSFULLY!',
   SOMETHING_WENT_WRONG: 'SOMETHING WENT WRONG. TRY RE-LOGGING IN.',
   FAILURE: 'FAILED TO SAVE CHANGES. TRY RE-LOGGING IN.',
   GAME_WITH_ID_NOT_FOUND: 'GAME COULD NOT BE FOUND',
}

export const MATCH_TYPES = {
   QUICK_MATCH: 'QUICK MATCH',
   RANKED_MATCH: 'RANKED MATCH',
   QUICK_MATCH_ID: 'QUICK MATCH (ID)',
   REPLAY: 'REPLAY',
}

export const TIP_TEXTS = {
   MENU_QM_ID: 'Log in to play match with id',
   MENU_RANKED: 'Log in to play ranked match',
   MENU_ACCOUNT: 'Log in to manage your account',
   STATS_PLAYED:
      'Total played divided by total seen. Example: in 10 games card has been seen 5 times and played 2 times. % Most Played for that card is 40%. If two or more cards have the same percentage, higher rank receives cards with more played count.',
   STATS_PURCHASED:
      'Total purchased divided by total seen. Example: in 10 games card has been seen 5 times and purchased 2 times. % Most Purchased for that card is 40%. If two or more cards have the same percentage, higher rank receives cards with more purchased count.',
   REPLAY: 'This button is disabled in the replay mode.',
}

export const CONFIRMATION_TEXT = {
   DRAFT_GEN1: 'Are you sure you want to choose this corporation and these project cards?',
   DRAFT_NOCARDS: "Are you sure you don't want to buy any cards?",
   DRAFT_CARDS: 'Are you sure you want to buy these project cards?',
   SELLCARDS: 'Are you sure you want to sell these project cards?',
   ENDGAME: 'Leave the game and go back to main menu?',
   SP_POWERPLANT: 'Do you want to build a power plant?',
   SP_ASTEROID: 'Do you want to use the asteroid project?',
   SP_AQUIFER: 'Do you want to build an aquifer?',
   SP_GREENERY: 'Do you want to build a greenery?',
   SP_CITY: 'Do you want to build a city?',
   CONVERT_HEAT: 'Do you want to convert 8 heat to increase the temperature?',
}

export const COMMUNICATION = {
   SYNC_ERROR: 'THERE ARE SOME ISSUES WITH UPDATING GAME ON SERVER',
}
