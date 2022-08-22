import { useState, createContext, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { addNeutralTiles } from './utils/misc'
import { INIT_STATE_PLAYER } from './initStates/initStatePlayer'
import { INIT_STATE_GAME } from './initStates/initStateGame'
import { INIT_MODALS } from './initStates/initModals'
import { INIT_BOARD } from './initStates/initBoard'
import { LOG_TYPES } from './data/log'
import Menu from './components/mainMenu/pages/Menu'
import Stats from './components/mainMenu/pages/stats/Stats'
import Settings from './components/mainMenu/pages/Settings'
import Login from './components/mainMenu/pages/Login'
import Register from './components/mainMenu/pages/Register'
import Account from './components/mainMenu/pages/Account'
import Game from './components/game/Game'
import MainMenu from './components/mainMenu/MainMenu'
import { createActiveGameData, getActiveGameData } from './api/apiActiveGame'
import { getRandIntNumbers } from './api/apiOther'
import { updateUser } from './api/apiUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeMute, faVolumeOff } from '@fortawesome/free-solid-svg-icons'
import { createMatchWithId } from './api/apiMatchWithId'
// Music
import { Howl } from 'howler'
import {
   music_src,
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
import Ranking from './components/mainMenu/pages/ranking/Ranking'

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
   const [initCardsIds, setInitCardsIds] = useState()
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
   const music = useMemo(() => new Howl({ src: music_src, loop: true }), [])
   const sound = useMemo(
      () => ({
         raiseParameter: new Howl({ src: raiseParameter }),
         prodBetweenGens: new Howl({ src: prodBetweenGens }),
         payResProd: new Howl({ src: payResProd }),
         getTR: new Howl({ src: getTR }),
         getResProd: new Howl({ src: getResProd }),
         btnSPorOtherSnap: new Howl({ src: btnSPorOtherSnap }),
         btnSelectClick: new Howl({ src: btnSelectClick }),
         btnGeneralClick: new Howl({ src: btnGeneralClick }),
         btnCardsClick: new Howl({ src: btnCardsClick }),
         objectPut: new Howl({ src: objectPut }),
      }),
      []
   )

   const [isMusicPlaying, setIsMusicPlaying] = useState(false)
   // Other
   const [showLogoutMsg, setShowLogoutMsg] = useState(true)

   function handleClickMusicPlayPause() {
      setIsMusicPlaying((prev) => !prev)
   }
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
         initCards: null,
         logItems: null,
      }
      let token = user?.token
      if (!token) {
         // User not logged in
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
            // ============= Game not started
            if (type === 'quickMatchId') {
               await initNewGameId(gameData, matchWithId)
            } else {
               await initNewGame(gameData)
            }
            // Save init game data to the server
            await createActiveGameData(
               user.token,
               {
                  id: gameData.id,
                  statePlayer: gameData.statePlayer,
                  stateGame: gameData.stateGame,
                  stateModals: gameData.stateModals,
                  stateBoard: gameData.stateBoard,
                  corps: gameData.corps,
                  initCards: gameData.initCards,
                  logItems: gameData.logItems,
               },
               type
            )
            // Update user
            const { data } = await updateUser(user.token, {
               activeMatches: {
                  quickMatch: type === 'quickMatch' ? true : user.activeMatches.quickMatch,
                  quickMatchId: type === 'quickMatchId' ? true : user.activeMatches.quickMatchId,
                  ranked: type === 'ranked' ? true : user.activeMatches.ranked,
               },
            })
            localStorage.setItem('user', JSON.stringify(data))
            setUser(data)
         } else {
            // ============= Game already started
            gameData = await getActiveGameData(user.token, type)
         }
      }

      // Assign Data to states
      setInitId(gameData.id)
      setInitStatePlayer(gameData.statePlayer)
      setInitStateGame(gameData.stateGame)
      setInitStateModals(gameData.stateModals)
      setInitStateBoard(gameData.stateBoard)
      setInitCorpsIds(gameData.corps)
      setInitCardsIds(gameData.initCards)
      setInitLogItems(gameData.logItems)
      setType(type)
   }

   async function initNewGame(gameData) {
      const board = JSON.parse(JSON.stringify(INIT_BOARD))
      gameData.statePlayer = INIT_STATE_PLAYER
      gameData.stateGame = INIT_STATE_GAME
      gameData.stateModals = INIT_MODALS
      gameData.stateBoard = addNeutralTiles(board)
      gameData.corps = await getRandIntNumbers(2, 1, 12)
      gameData.initCards = await getRandIntNumbers(10, 1, 208)
      gameData.logItems = [
         { type: LOG_TYPES.LOG, data: null },
         { type: LOG_TYPES.GENERATION, data: { text: '1' } },
      ]
   }

   async function initNewGameId(gameData, matchWithId) {
      if (matchWithId) {
         // Start already created Match With Id
         gameData.id = matchWithId._id
         gameData.statePlayer = INIT_STATE_PLAYER
         gameData.stateGame = INIT_STATE_GAME
         gameData.stateModals = INIT_MODALS
         gameData.stateBoard = matchWithId.stateBoard
         gameData.corps = matchWithId.corps
         gameData.initCards = matchWithId.cards.slice(0, 10)
         gameData.logItems = [
            { type: LOG_TYPES.LOG, data: null },
            { type: LOG_TYPES.GENERATION, data: { text: '1' } },
         ]
      } else {
         // Create New Match With Id
         const board = JSON.parse(JSON.stringify(INIT_BOARD))
         const randomCardsIds = await getRandIntNumbers(208, 1, 208)
         gameData.statePlayer = INIT_STATE_PLAYER
         gameData.stateGame = INIT_STATE_GAME
         gameData.stateModals = INIT_MODALS
         gameData.stateBoard = addNeutralTiles(board)
         gameData.corps = await getRandIntNumbers(2, 1, 12)
         gameData.initCards = randomCardsIds.slice(0, 10)
         gameData.logItems = [
            { type: LOG_TYPES.LOG, data: null },
            { type: LOG_TYPES.GENERATION, data: { text: '1' } },
         ]
         const matchId = await createMatchWithId(user.token, {
            stateBoard: gameData.stateBoard,
            corps: gameData.corps,
            cards: randomCardsIds,
         })
         gameData.id = matchId._id
      }
   }

   function logout() {
      localStorage.removeItem('user')
      setUser(null)
      setShowLogoutMsg(true)
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
                              element={
                                 <Menu
                                    user={user}
                                    setUser={setUser}
                                    setData={setData}
                                    logout={logout}
                                    showLogoutMsg={showLogoutMsg}
                                    setShowLogoutMsg={setShowLogoutMsg}
                                 />
                              }
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
                                 initCardsIds={initCardsIds}
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
                  <div className="btn-music pointer" onClick={handleClickMusicPlayPause}>
                     {isMusicPlaying ? (
                        <FontAwesomeIcon icon={faVolumeOff} />
                     ) : (
                        <FontAwesomeIcon icon={faVolumeMute} />
                     )}
                  </div>
               </div>
            </SoundContext.Provider>
         </SettingsContext.Provider>
      </ModalConfirmationContext.Provider>
   )
}

export default App
