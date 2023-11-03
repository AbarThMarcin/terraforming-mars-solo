import { useState, createContext, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from './components/mainMenu/pages/menu/Menu'
import Stats from './components/mainMenu/pages/stats'
import Settings from './components/mainMenu/pages/settings/Settings'
import Login from './components/mainMenu/pages/loginRegister/Login'
import Register from './components/mainMenu/pages/loginRegister/Register'
import Account from './components/mainMenu/pages/account/Account'
import Game from './components/game'
import MainMenu from './components/mainMenu'
import Ranking from './components/mainMenu/pages/ranking'
import BtnMusic from './components/misc/BtnMusic'
import Version from './components/misc/versions'
import ModalVersions from './components/misc/versions/modalVersions'
import { getLogAndStatesConvertedForGame, getThinerStatePlayerForActive, getStatePlayerWithAllDataFromActive } from './utils/dataConversion'
import { range } from './utils/array'
import { getCards } from './utils/cards'
import { getBoardWithNeutralTiles } from './utils/board'
import { INIT_STATE_PLAYER } from './initStates/initStatePlayer'
import { INIT_STATE_GAME } from './initStates/initStateGame'
import { INIT_MODALS } from './initStates/initModals'
import { INIT_BOARD } from './initStates/initBoard'
import { INIT_LOG_ITEMS } from './initStates/initLogItems'
import { MATCH_TYPES, INIT_SETTINGS } from './data/app'
import { createActiveGameData, getActiveGameData } from './api/activeGame'
import { getRandIntNumbers } from './api/other'
import { updateUser } from './api/user'
import { createMatchWithId } from './api/matchWithId'
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

export const ModalConfirmationContext = createContext()
export const SettingsContext = createContext()
export const SoundContext = createContext()

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
   const [initDurationSeconds, setInitDurationSeconds] = useState()
   // Match Type
   const [type, setType] = useState()
   const [dataForReplay, setDataForReplaty] = useState(null)
   // Modal Confirmation Details
   const [showModalConf, setShowModalConf] = useState(false)
   // Modal QM With Id Details
   const [showModalQMId, setShowModalQMId] = useState(false)
   const [overwrite, setOverwrite] = useState(false)
   // App Settings
   const [settings, setSettings] = useState(INIT_SETTINGS)
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
         music.volume(INIT_SETTINGS.musicVolume)
         Object.keys(sound).forEach((key) => sound[key].volume(INIT_SETTINGS.gameVolume))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   async function setDataForGame({ type, restartMatch = false, matchWithId = null, dataForReplay = null }) {
      // Empty Data
      let gameData = {
         id: null,
         statePlayer: null,
         stateGame: null,
         stateModals: null,
         stateBoard: null,
         initStateBoard: null,
         corps: null,
         logItems: null,
         durationSeconds: null,
         dataForReplay: null,
      }
      if (type === MATCH_TYPES.REPLAY) {
         initNewGameForReplay(gameData, dataForReplay)
      } else {
         let token = user?.token
         if (!token) {
            // User not logged in = Quick Match
            await initNewGame(gameData)
         } else {
            let matchStarted
            switch (type) {
               case MATCH_TYPES.QUICK_MATCH:
                  matchStarted = user.activeMatches.quickMatch
                  break
               case MATCH_TYPES.QUICK_MATCH_ID:
                  matchStarted = user.activeMatches.quickMatchId
                  break
               case MATCH_TYPES.RANKED_MATCH:
                  matchStarted = user.activeMatches.ranked
                  break
               default:
                  break
            }
            if (!matchStarted || restartMatch) {
               // Game not started
               if (type === MATCH_TYPES.QUICK_MATCH_ID) {
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
                     statePlayer: getThinerStatePlayerForActive(gameData.statePlayer),
                     stateGame: gameData.stateGame,
                     stateModals: gameData.stateModals,
                     stateBoard: gameData.stateBoard,
                     initStateBoard: gameData.initStateBoard,
                     corps: gameData.corps,
                     logItems: gameData.logItems,
                     startTime: new Date().toJSON(),
                     durationSeconds: gameData.durationSeconds,
                  },
                  type
               )
               if (!newData?.corps) return

               // Update user
               const res = await updateUser(user.token, {
                  activeMatches: {
                     quickMatch: type === MATCH_TYPES.QUICK_MATCH ? true : user.activeMatches.quickMatch,
                     quickMatchId: type === MATCH_TYPES.QUICK_MATCH_ID ? true : user.activeMatches.quickMatchId,
                     ranked: type === MATCH_TYPES.RANKED_MATCH ? true : user.activeMatches.ranked,
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
               const { convertedLogItems } = getLogAndStatesConvertedForGame(gameData.logItems, gameData.initStateBoard, gameData.statePlayer.cardsDeckIds, false)
               gameData = {
                  ...gameData,
                  statePlayer: getStatePlayerWithAllDataFromActive(gameData.statePlayer),
                  logItems: convertedLogItems,
               }
            }
         }
      }

      // Assign Data to states
      setInitId(gameData.id)
      setInitStatePlayer(gameData.statePlayer)
      setInitStateGame(gameData.stateGame)
      setInitStateModals(gameData.stateModals)
      setInitStateBoard(gameData.initStateBoard)
      setInitCorpsIds(gameData.corps)
      setInitLogItems(gameData.logItems)
      setInitDurationSeconds(gameData.durationSeconds)
      setType(type)
      setDataForReplaty(dataForReplay)

      return 'Ok'
   }

   async function initNewGame(gameData) {
      const board = JSON.parse(JSON.stringify(INIT_BOARD))

      const initCardsIds = await getRandIntNumbers(10, 1, 208)
      // const initCardsIds = [12, 20, 195, 131, 5, 6, 7, 8, 73, 90]
      const initCorpsIds = await getRandIntNumbers(2, 1, 12)
      // const initCorpsIds = [12, 3]

      const leftCardsIds = range(1, 208).filter((id) => !initCardsIds.includes(id))
      const initCards = getCards(initCardsIds)
      gameData.stateGame = INIT_STATE_GAME
      gameData.stateModals = INIT_MODALS
      gameData.stateBoard = getBoardWithNeutralTiles(board)
      gameData.initStateBoard = gameData.stateBoard
      gameData.corps = initCorpsIds
      gameData.statePlayer = {
         ...INIT_STATE_PLAYER,
         cardsSeen: initCards,
         cardsDeckIds: leftCardsIds,
         cardsDrawIds: initCardsIds,
      }
      gameData.logItems = INIT_LOG_ITEMS
      gameData.durationSeconds = 0
   }

   async function initNewGameId(gameData, matchWithId) {
      if (matchWithId) {
         // Start already created Match With Id
         const initCardsIds = matchWithId.cards.slice(0, 10)
         const leftCardsIds = range(1, 208).filter((id) => !initCardsIds.includes(id))
         const initCards = getCards(initCardsIds)
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
         gameData.initStateBoard = matchWithId.stateBoard
         gameData.corps = matchWithId.corps
         gameData.logItems = INIT_LOG_ITEMS
         gameData.durationSeconds = matchWithId.durationSeconds
      } else {
         // Create New Match With Id
         const board = JSON.parse(JSON.stringify(INIT_BOARD))
         const initCardsIds = await getRandIntNumbers(208, 1, 208)
         // const initCardsIds = [...[90, 111, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 33, 13, 14, 15, 16, 17, 18], ...(await getRandIntNumbers(188, 1, 188))]
         const initCorpsIds = await getRandIntNumbers(2, 1, 12)
         // const initCorpsIds = [5, 2]
         const leftCardsIds = range(1, 208).filter((id) => !initCardsIds.slice(0, 10).includes(id))
         const initCards = getCards(initCardsIds.slice(0, 10))
         gameData.statePlayer = {
            ...INIT_STATE_PLAYER,
            cardsSeen: initCards.slice(0, 10),
            cardsDeckIds: leftCardsIds,
            cardsDrawIds: initCardsIds.slice(0, 10),
         }
         gameData.stateGame = INIT_STATE_GAME
         gameData.stateModals = INIT_MODALS
         gameData.stateBoard = getBoardWithNeutralTiles(board)
         gameData.initStateBoard = gameData.stateBoard
         gameData.corps = initCorpsIds
         gameData.logItems = INIT_LOG_ITEMS
         gameData.durationSeconds = 0
         const matchId = await createMatchWithId(user.token, {
            stateBoard: gameData.stateBoard,
            corps: initCorpsIds,
            cards: initCardsIds,
         })
         gameData.id = matchId._id
      }
   }

   function initNewGameForReplay(gameData, dataForReplay) {
      const initCardsIds = dataForReplay.cards.seen.slice(0, 10).map((c) => c.id)
      const leftCardsIds = range(1, 208).filter((id) => !initCardsIds.includes(id))
      const initCards = getCards(initCardsIds)
      gameData.statePlayer = {
         ...INIT_STATE_PLAYER,
         cardsSeen: initCards,
         cardsDeckIds: leftCardsIds,
         cardsDrawIds: initCardsIds,
      }
      gameData.stateGame = INIT_STATE_GAME
      gameData.stateModals = INIT_MODALS
      gameData.stateBoard = dataForReplay.initStateBoard
      gameData.initStateBoard = dataForReplay.initStateBoard
      gameData.corps = dataForReplay.initCorps
      gameData.logItems = INIT_LOG_ITEMS
      gameData.durationSeconds = 0
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
                           <Route index element={<Menu user={user} setUser={setUser} setDataForGame={setDataForGame} />} />
                           <Route path="stats" element={<Stats user={user} setDataForGame={setDataForGame} />} />
                           <Route path="settings" element={<Settings user={user} setUser={setUser} />} />
                           <Route path="ranking" element={<Ranking />} />
                           <Route path="login" element={<Login setUser={setUser} />} />
                           <Route path="register" element={<Register setUser={setUser} />} />
                           <Route path="account" element={<Account user={user} setUser={setUser} />} />
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
                                 initDurationSeconds={initDurationSeconds}
                                 type={type}
                                 user={user}
                                 setUser={setUser}
                                 dataForReplay={dataForReplay}
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
                  <div className="not-affiliated">This app is not not affiliated with FryxGames, Asmodee Digital or Steam in any way.</div>
                  {/* Modal Versions */}
                  {showVersions && <ModalVersions setShowVersions={setShowVersions} />}
               </div>
            </SoundContext.Provider>
         </SettingsContext.Provider>
      </ModalConfirmationContext.Provider>
   )
}

export default App
