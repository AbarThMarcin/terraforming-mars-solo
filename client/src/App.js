import { useState, createContext, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { addNeutralTiles, getCards, range } from './utils/misc'
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
import { createMatchWithId } from './api/apiMatchWithId'
import Ranking from './components/mainMenu/pages/ranking/Ranking'
import BtnMusic from './components/misc/BtnMusic'
import Version from './components/misc/versions/Version'
import ModalVersions from './components/misc/versions/ModalVersions'
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
import { CARDS } from './data/cards'

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
   // Versions
   const [showVersions, setShowVersions] = useState(false)

   const [isMusicPlaying, setIsMusicPlaying] = useState(false)
   // Other
   const [showLogoutMsg, setShowLogoutMsg] = useState(true)

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
      setInitLogItems(gameData.logItems)
      setType(type)
   }

   async function initNewGame(gameData) {
      const board = JSON.parse(JSON.stringify(INIT_BOARD))
      const initCardsIds = await getRandIntNumbers(10, 1, 208)
      // const initCardsIds = [84, 90, 185, 73, 5, 6, 7, 8, 9, 10]
      const initCorpsIds = await getRandIntNumbers(2, 1, 12)
      // const initCorpsIds = [3, 11]
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
                  {/* Version */}
                  <Version setShowVersions={setShowVersions} />
                  {/* Modal Versions */}
                  {showVersions && <ModalVersions setShowVersions={setShowVersions} />}
               </div>
            </SoundContext.Provider>
         </SettingsContext.Provider>
      </ModalConfirmationContext.Provider>
   )
}

export default App
