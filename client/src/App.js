import { useState, createContext, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { addNeutralTiles, getCards, range } from './utils/misc'
import { INIT_STATE_PLAYER } from './initStates/initStatePlayer'
import { INIT_STATE_GAME } from './initStates/initStateGame'
import { INIT_MODALS } from './initStates/initModals'
import { INIT_BOARD } from './initStates/initBoard'
import { LOG_TYPES } from './data/log'
import Menu from './components/mainMenu/pages/menu/Menu'
import Stats from './components/mainMenu/pages/stats'
import Settings from './components/mainMenu/pages/settings/Settings'
import Login from './components/mainMenu/pages/loginRegister/Login'
import Register from './components/mainMenu/pages/loginRegister/Register'
import Account from './components/mainMenu/pages/account/Account'
import Game from './components/game'
import MainMenu from './components/mainMenu'
import { createActiveGameData, getActiveGameData } from './api/activeGame'
import { getRandIntNumbers } from './api/other'
import { updateUser } from './api/user'
import { createMatchWithId } from './api/matchWithId'
import Ranking from './components/mainMenu/pages/ranking'
import BtnMusic from './components/misc/BtnMusic'
import Version from './components/misc/versions'
import ModalVersions from './components/misc/versions/modalVersions'
import './app.css'
// Music
import { Howl } from 'howler'
import {
   soundtrack1,
   raiseParameter,
   prodBetweenGens,
   payResProd,
   getTR,
   getResProd,
   btnSPorOtherSnap,
   btnSelectClick,
   btnGeneralClick,
   btnCardsClick,
   objectPut,
} from './data/gameSound'
import { CARDS } from './data/cards'
// import Music from './components/misc/Music'

export const ModalConfirmationContext = createContext()
export const SettingsContext = createContext()
export const SoundContext = createContext()

export const TABS = {
   GENERAL_STATISTICS: 'General Statistics',
   GENERAL_ACHIEVEMENTS: 'General Achievements',
   PLAYER_OVERVIEW: 'Player Overview',
   PLAYER_DETAILS: 'Player Details',
   GAMES: 'Games',
   RANKING_PRIMARY: 'Ranking Primary',
   RANKING_SECONDARY: 'Ranking Secondary',
   RANKING_RULES: 'Ranking Rules',
}

const defaultSettings = {
   speedId: 2,
   showTotVP: false,
   sortId: ['4a', '4a-played'],
   musicVolume: 0.5,
   gameVolume: 0.5,
}

export const APP_MESSAGES = {
   SUCCESS: 'CHANGES SAVED SUCCESSFULLY!',
   LOGGED_OUT: 'YOU HAVE LOGGED OUT SUCCESSFULLY!',
   SOMETHING_WENT_WRONG: 'SOMETHING WENT WRONG. TRY RE-LOGGING IN.',
   FAILURE: 'FAILED TO SAVE CHANGES. TRY RE-LOGGING IN.',
   GAME_WITH_ID_NOT_FOUND: 'GAME COULD NOT BE FOUND',
}

function App() {
   // User
   const [user, setUser] = useState(null)
   // Game States
   const [initId, setInitId] = useState()
   const [initStatePlayer, setInitStatePlayer] = useState()
   const [initStateGame, setInitStateGame] = useState()
   const [initStateModals, setInitStateModals] = useState()
   const [initStateBoard, setInitStateBoard] = useState()
   const [initCorpsIds, setInitCorpsIds] = useState()
   const [initLogItems, setInitLogItems] = useState()
   // Match Type
   const [type, setType] = useState()
   // Modal Confirmation Details
   const [showModalConf, setShowModalConf] = useState(false)
   // Modal QM With Id Details
   const [showModalQMId, setShowModalQMId] = useState(false)
   const [overwrite, setOverwrite] = useState(false)
   // App Settings
   const [settings, setSettings] = useState(defaultSettings)
   // Music && Game Sound
   const [isMusicPlaying, setIsMusicPlaying] = useState(false)
   const music = useMemo(() => new Howl({ src: soundtrack1, loop: true }), [])
   const sound = useMemo(
      () => ({
         raiseParameter: new Howl({ src: raiseParameter }),
         prodBetweenGens: new Howl({ src: prodBetweenGens }),
         payResProd: new Howl({ src: payResProd }),
         getTR: new Howl({ src: getTR }),
         getResProd: new Howl({ src: getResProd }),
         btnSPorOtherSnap: new Howl({ src: btnSPorOtherSnap }),
         btnSelectClick: new Howl({ src: btnSelectClick }),
         btnGeneralClick: new Howl({ src: [btnGeneralClick, btnSelectClick] }),
         btnCardsClick: new Howl({ src: btnCardsClick }),
         objectPut: new Howl({ src: objectPut }),
      }),
      []
   )
   // Versions
   const [showVersions, setShowVersions] = useState(false)

   useEffect(() => {
      if (isMusicPlaying) {
         music.play()
      } else {
         music.pause()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isMusicPlaying])

   useEffect(() => {
      const userInfo = localStorage.getItem('user')
      if (userInfo) {
         const user = JSON.parse(userInfo)
         setUser(user)
         setSettings({
            speedId: user.settings.gameSpeed,
            showTotVP: user.settings.showTotalVP,
            sortId: [user.settings.handSortId, user.settings.playedSortId],
            musicVolume: user.settings.musicVolume,
            gameVolume: user.settings.gameVolume,
         })
         music.volume(user.settings.musicVolume)
         Object.keys(sound).forEach((key) => sound[key].volume(user.settings.gameVolume))
      } else {
         music.volume(defaultSettings.musicVolume)
         Object.keys(sound).forEach((key) => sound[key].volume(defaultSettings.gameVolume))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   async function setData(type, restartMatch = false, matchWithId = null) {
      // Empty Data
      let gameData = {
         id: null,
         statePlayer: null,
         stateGame: null,
         stateModals: null,
         stateBoard: null,
         corps: null,
         logItems: null,
      }
      let token = user?.token
      if (!token) {
         // User not logged in = Quick Match
         await initNewGame(gameData)
      } else {
         let matchStarted
         switch (type) {
            case 'quickMatch':
               matchStarted = user.activeMatches.quickMatch
               break
            case 'quickMatchId':
               matchStarted = user.activeMatches.quickMatchId
               break
            case 'ranked':
               matchStarted = user.activeMatches.ranked
               break
            default:
               break
         }
         if (!matchStarted || restartMatch) {
            // Game not started
            if (type === 'quickMatchId') {
               await initNewGameId(gameData, matchWithId) // Quick Match with ID
            } else {
               await initNewGame(gameData) // Quick Match or Ranked Match
            }

            // Save init game data to the server
            let newData
            newData = await createActiveGameData(
               user.token,
               {
                  id: gameData.id,
                  statePlayer: gameData.statePlayer,
                  stateGame: gameData.stateGame,
                  stateModals: gameData.stateModals,
                  stateBoard: gameData.stateBoard,
                  corps: gameData.corps,
                  logItems: gameData.logItems,
               },
               type
            )
            if (!newData?.corps) return

            // Update user
            const res = await updateUser(user.token, {
               activeMatches: {
                  quickMatch: type === 'quickMatch' ? true : user.activeMatches.quickMatch,
                  quickMatchId: type === 'quickMatchId' ? true : user.activeMatches.quickMatchId,
                  ranked: type === 'ranked' ? true : user.activeMatches.ranked,
               },
            })
            if (res.data) {
               localStorage.setItem('user', JSON.stringify(res.data))
               setUser(res.data)
            } else {
               return
            }
         } else {
            // Game already started
            gameData = await getActiveGameData(user.token, type)
            if (!gameData?.corps) return
         }
      }

      // Assign Data to states
      setInitId(gameData.id)
      setInitStatePlayer(gameData.statePlayer)
      setInitStateGame(gameData.stateGame)
      setInitStateModals(gameData.stateModals)
      setInitStateBoard(gameData.stateBoard)
      setInitCorpsIds(gameData.corps)
      setInitLogItems(gameData.logItems)
      setType(type)

      return 'Ok'
   }

   async function initNewGame(gameData) {
      const board = JSON.parse(JSON.stringify(INIT_BOARD))

      const initCardsIds = await getRandIntNumbers(10, 1, 208)
      // const initCardsIds = [71, 81, 105, 73, 64, 67, 7, 8, 192, 111]
      const initCorpsIds = await getRandIntNumbers(2, 1, 12)
      // const initCorpsIds = [12, 3]

      const leftCardsIds = range(1, 208).filter((id) => !initCardsIds.includes(id))
      const initCards = getCards(CARDS, initCardsIds)
      gameData.stateGame = INIT_STATE_GAME
      gameData.stateModals = INIT_MODALS
      gameData.stateBoard = addNeutralTiles(board)
      gameData.corps = initCorpsIds
      gameData.statePlayer = {
         ...INIT_STATE_PLAYER,
         cardsSeen: initCards,
         cardsDeckIds: leftCardsIds,
         cardsDrawIds: initCardsIds,
      }
      gameData.logItems = [
         { type: LOG_TYPES.LOG, data: null },
         { type: LOG_TYPES.GENERATION, data: { text: '1' } },
      ]
   }

   async function initNewGameId(gameData, matchWithId) {
      if (matchWithId) {
         // Start already created Match With Id
         const initCardsIds = matchWithId.cards.slice(0, 10)
         const leftCardsIds = range(1, 208).filter((id) => !initCardsIds.includes(id))
         const initCards = getCards(CARDS, initCardsIds)
         gameData.id = matchWithId._id
         gameData.statePlayer = {
            ...INIT_STATE_PLAYER,
            cardsSeen: initCards,
            cardsDeckIds: leftCardsIds,
            cardsDrawIds: initCardsIds,
         }
         gameData.stateGame = INIT_STATE_GAME
         gameData.stateModals = INIT_MODALS
         gameData.stateBoard = matchWithId.stateBoard
         gameData.corps = matchWithId.corps
         gameData.logItems = [
            { type: LOG_TYPES.LOG, data: null },
            { type: LOG_TYPES.GENERATION, data: { text: '1' } },
         ]
      } else {
         // Create New Match With Id
         const board = JSON.parse(JSON.stringify(INIT_BOARD))
         const initCardsIds = await getRandIntNumbers(208, 1, 208)
         // const initCardsIds = [...[204, 185, 90, 192, 196, 5, 23, 73, 35, 19], ...await getRandIntNumbers(198, 1, 198)]
         const initCorpsIds = await getRandIntNumbers(2, 1, 12)
         // const initCorpsIds = [1, 2]
         const leftCardsIds = range(1, 208).filter((id) => !initCardsIds.slice(0, 10).includes(id))
         const initCards = getCards(CARDS, initCardsIds.slice(0, 10))
         gameData.statePlayer = {
            ...INIT_STATE_PLAYER,
            cardsSeen: initCards.slice(0, 10),
            cardsDeckIds: leftCardsIds,
            cardsDrawIds: initCardsIds.slice(0, 10),
         }
         gameData.stateGame = INIT_STATE_GAME
         gameData.stateModals = INIT_MODALS
         gameData.stateBoard = addNeutralTiles(board)
         gameData.corps = initCorpsIds
         gameData.logItems = [
            { type: LOG_TYPES.LOG, data: null },
            { type: LOG_TYPES.GENERATION, data: { text: '1' } },
         ]
         const matchId = await createMatchWithId(user.token, {
            stateBoard: gameData.stateBoard,
            corps: initCorpsIds,
            cards: initCardsIds,
         })
         gameData.id = matchId._id
      }
   }

   return (
      <ModalConfirmationContext.Provider
         value={{
            showModalConf,
            setShowModalConf,
            showModalQMId,
            setShowModalQMId,
            overwrite,
            setOverwrite,
         }}
      >
         <SettingsContext.Provider value={{ settings, setSettings }}>
            <SoundContext.Provider value={{ music, sound }}>
               <div className="app">
                  <Router>
                     <Routes>
                        <Route path="/" element={<MainMenu />}>
                           <Route
                              index
                              element={<Menu user={user} setUser={setUser} setData={setData} />}
                           />
                           <Route path="stats" element={<Stats user={user} />} />
                           <Route
                              path="settings"
                              element={<Settings user={user} setUser={setUser} />}
                           />
                           <Route path="ranking" element={<Ranking />} />
                           <Route path="login" element={<Login setUser={setUser} />} />
                           <Route path="register" element={<Register setUser={setUser} />} />
                           <Route
                              path="account"
                              element={<Account user={user} setUser={setUser} />}
                           />
                        </Route>
                        <Route
                           path="match"
                           element={
                              <Game
                                 id={initId}
                                 initStatePlayer={initStatePlayer}
                                 initStateGame={initStateGame}
                                 initStateModals={initStateModals}
                                 initStateBoard={initStateBoard}
                                 initCorpsIds={initCorpsIds}
                                 initLogItems={initLogItems}
                                 type={type}
                                 user={user}
                                 setUser={setUser}
                              />
                           }
                        />
                     </Routes>
                  </Router>
                  {/* Turn on / off music button */}
                  <BtnMusic isMusicPlaying={isMusicPlaying} setIsMusicPlaying={setIsMusicPlaying} />
                  {/* <Music /> */}
                  {/* Version */}
                  <Version setShowVersions={setShowVersions} />
                  {/* Not Affiliated */}
                  <div className="not-affiliated">
                     This app is not not affiliated with FryxGames, Asmodee Digital or Steam in any
                     way.
                  </div>
                  {/* Modal Versions */}
                  {showVersions && <ModalVersions setShowVersions={setShowVersions} />}
               </div>
            </SoundContext.Provider>
         </SettingsContext.Provider>
      </ModalConfirmationContext.Provider>
   )
}

export default App
