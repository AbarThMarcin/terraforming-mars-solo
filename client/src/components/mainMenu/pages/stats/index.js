import { createContext, useEffect, useState } from 'react'
import { getEndedGameData } from '../../../../api/endedGame'
import { getSeason } from '../../../../api/other'
import { getUsers } from '../../../../api/user'
import FilterSeason from './filters/FilterSeason'
import FilterCorp from './filters/FilterCorp'
import FilterUser from './filters/FilterUser'
import General from './general'
import Player from './player'
import Games from './games'
import BtnGoBack from '../../BtnGoBack'
import spinner from '../../../../assets/other/spinner.gif'
import Modal from './games/Modal'
import { motion, AnimatePresence } from 'framer-motion'
import ModalCard from './player/statsCards/ModalCard'
import ModalSeeAllCards from './player/statsCards/ModalSeeAllCards'
import GamesLog from './games/GamesLog'
import { getLogAndStatesConvertedForGame } from '../../../../utils/dataConversion'
import { getCorporationById } from '../../../../utils/corporation'
import Corp from '../../../game/components/corp/Corp'
import { TABS } from '../../../../data/app'

export const TabTypeContext = createContext()
export const DataContext = createContext()
export const PlayersContext = createContext()
export const ModalsContext = createContext()

const Stats = ({ user, setDataForGame }) => {
   const [type, setType] = useState(TABS.GENERAL_STATISTICS)
   const [dataForStats, setDataForStats] = useState()
   const [allPlayers, setAllPlayers] = useState()
   const [currPlayers, setCurrPlayers] = useState()
   const [currPlayerId, setCurrPlayerId] = useState()
   // Modal for Links & Comments
   const [showModal, setShowModal] = useState(false)
   const [modalText, setModalText] = useState('')
   const [editMode, setEditMode] = useState(false)
   const [linkOrComment, setLinkOrComment] = useState('')
   const [gameId, setGameId] = useState()
   const [game, setGame] = useState()
   // Modal for card
   const [showModalCard, setShowModalCard] = useState(false)
   const [modalCard, setModalCard] = useState(null)
   // Modal for corp
   const [showModalCorp, setShowModalCorp] = useState(false)
   const [modalCorpId, setModalCorpId] = useState(null)
   // Modal for 'See all cards'
   const [showModalAllCards, setShowModalAllCards] = useState(false)
   const [modalCardsIds, setModalCardsIds] = useState()
   const [modalCardsTitle, setModalCardsTitle] = useState('')
   // Filters
   const [season, setSeason] = useState()
   const [corp, setCorp] = useState('ALL CORPORATIONS')
   const [userValue, setUserValue] = useState('')

   useEffect(() => {
      const fetchData = async () => {
         const initUsers = await getUsers()
         let initGames = await getEndedGameData()
         initGames = initGames.map((game) => {
            const { convertedLogItems } = getLogAndStatesConvertedForGame(game.logItems, game.initStateBoard, [...game.cards.seen.map((c) => c.id), ...game.cards.inDeck], game.forfeited)
            return {
               ...game,
               cards: game.cards,
               logItems: convertedLogItems,
            }
         })
         const initSeason = await getSeason()
         const initData = { users: initUsers, games: initGames, season: initSeason }
         // Set Data
         setDataForStats(initData)
         setAllPlayers(getPlayers(initUsers, initGames, 'lifetime'))
         setCurrPlayers(getPlayers(initUsers, initGames, initSeason))
         // Set Season Filter
         setSeason(initSeason)
      }
      fetchData()
   }, [])

   function getPlayers(users, games, season) {
      // Games filtered by season
      let filteredGames = season === 'lifetime' ? games : games.filter((game) => game.season === season)
      // List of users IDs that played filteredGames
      const usersIdsPlayed = filteredGames.map((game) => game.user)
      // Details of usersIdsPlayed
      const usersPlayed = users.filter((user) => usersIdsPlayed.includes(user._id))
      // Return users with their filtered games
      const players = usersPlayed.map((userPlayed) => {
         return {
            ...userPlayed,
            games: filteredGames.filter((game) => game.user === userPlayed._id),
         }
      })
      return players
   }

   function filterPlayers(season, userValue, corp) {
      const newCurrPlayers = []
      // Filter by user
      const filteredPlayers = allPlayers.filter((player) => player.name.toUpperCase().includes(userValue.toUpperCase()))
      filteredPlayers.forEach((player) => {
         // Filter by season
         let gamesBySeason = player.games
         if (season !== 'lifetime') gamesBySeason = player.games.filter((game) => game.season === season)
         // Filter by corp
         let gamesBySeasonAndCorp = gamesBySeason
         if (corp !== 'ALL CORPORATIONS') gamesBySeasonAndCorp = gamesBySeasonAndCorp.filter((game) => getCorporationById(game.corporation).name === corp)
         newCurrPlayers.push({
            ...player,
            games: gamesBySeasonAndCorp,
         })
      })
      setCurrPlayers(newCurrPlayers)
   }

   return (
      <>
         <ModalsContext.Provider
            value={{
               showModal,
               setShowModal,
               modalText,
               setModalText,
               editMode,
               setEditMode,
               linkOrComment,
               setLinkOrComment,
               gameId,
               setGameId,
               modalCard,
               setModalCard,
               setShowModalCard,
               modalCorpId,
               setModalCorpId,
               setShowModalCorp,
               modalCardsIds,
               setModalCardsIds,
               setShowModalAllCards,
               modalCardsTitle,
               setModalCardsTitle,
            }}
         >
            <TabTypeContext.Provider value={{ type, setType }}>
               <DataContext.Provider value={{ dataForStats, game, setGame }}>
                  <PlayersContext.Provider
                     value={{
                        currPlayers,
                        setCurrPlayers,
                        currPlayerId,
                        setCurrPlayerId,
                     }}
                  >
                     <div className="tabs-container green-border center">
                        {currPlayers ? (
                           <>
                              {/* Data */}
                              {(type === TABS.GENERAL_STATISTICS || type === TABS.GENERAL_ACHIEVEMENTS) && (
                                 <General filterPlayers={filterPlayers} season={season} setSeason={setSeason} setCorp={setCorp} userValue={userValue} />
                              )}
                              {(type === TABS.PLAYER_OVERVIEW || type === TABS.STATS_CARDS || type === TABS.STATS_OTHER) && (
                                 <Player filterPlayers={filterPlayers} season={season} corp={corp} setCorp={setCorp} userValue={userValue} />
                              )}
                              {type === TABS.GAMES && <Games user={user} setDataForGame={setDataForGame} />}
                              {type === TABS.GAMES_LOG && <GamesLog user={user} />}
                              {/* Filters */}
                              <div className="filters">
                                 {type !== TABS.GENERAL_ACHIEVEMENTS && type !== TABS.GAMES_LOG && (
                                    <FilterSeason filterPlayers={filterPlayers} season={season} setSeason={setSeason} corp={corp} userValue={userValue} dataForStats={dataForStats} />
                                 )}
                                 {(type === TABS.STATS_CARDS || type === TABS.STATS_OTHER || type === TABS.GAMES) && (
                                    <FilterCorp filterPlayers={filterPlayers} season={season} corp={corp} setCorp={setCorp} userValue={userValue} />
                                 )}
                                 {(type === TABS.GENERAL_STATISTICS || type === TABS.GENERAL_ACHIEVEMENTS) && (
                                    <FilterUser filterPlayers={filterPlayers} season={season} corp={corp} userValue={userValue} setUserValue={setUserValue} />
                                 )}
                              </div>
                           </>
                        ) : (
                           // Loading Spinner
                           <div className="spinner">
                              <img className="full-size" src={spinner} alt="loading_spinner" />
                           </div>
                        )}
                        <BtnGoBack type={type} setType={setType} filterPlayers={filterPlayers} season={season} corp={corp} setCorp={setCorp} userValue={userValue} />
                     </div>
                     {/* Modal Link & Comment */}
                     <AnimatePresence>
                        {showModal && (
                           <motion.div
                              key="keyModal"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.1 }}
                              exit={{ opacity: 0 }}
                              className="modal-background"
                           >
                              <Modal user={user} season={season} corp={corp} userValue={userValue} />
                           </motion.div>
                        )}
                     </AnimatePresence>
                     {/* Modal See All Cards */}
                     <AnimatePresence>
                        {showModalAllCards && (
                           <motion.div
                              key="keyModalSeeAllCards"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.1 }}
                              className="modal-background"
                              onClick={() => setShowModalAllCards(false)}
                           >
                              <ModalSeeAllCards />
                           </motion.div>
                        )}
                     </AnimatePresence>
                     {/* Modal Card View Only */}
                     <AnimatePresence>
                        {showModalCard && (
                           <motion.div
                              key="keyModalCardViewOnly"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.1 }}
                              className="modal-background"
                              onClick={() => setShowModalCard(false)}
                           >
                              <ModalCard />
                           </motion.div>
                        )}
                     </AnimatePresence>

                     {/* Modal Corp */}
                     <AnimatePresence>
                        {showModalCorp && (
                           <motion.div
                              key="keyModalCorp"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="modal-background"
                              onClick={() => setShowModalCorp(false)}
                           >
                              <div className="modal-corp-container center">
                                 <Corp corp={getCorporationById(modalCorpId)} />
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </PlayersContext.Provider>
               </DataContext.Provider>
            </TabTypeContext.Provider>
         </ModalsContext.Provider>
      </>
   )
}

export default Stats
