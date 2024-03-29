import { createContext, useContext, useEffect, useState } from 'react'
import { SoundContext } from '../../../../App'
import BtnGoBack from '../../BtnGoBack'
import RankingPrimary from './RankingPrimary'
import RankingRules from './RankingRules'
import RankingSecondary from './RankingSecondary'
import spinner from '../../../../assets/other/spinner.gif'
import { getUsers } from '../../../../api/user'
import { getEndedGameData } from '../../../../api/endedGame'
import { getSeason } from '../../../../api/other'
import FilterSeason from '../stats/filters/FilterSeason'
import { getLogAndStatesConvertedForGame } from '../../../../utils/dataConversion'
import { TABS } from '../../../../data/app'

export const TabTypeContext = createContext()
export const DataContext = createContext()
export const PlayersContext = createContext()

const GAMES_COUNT_PRIMARY_SEASON = 50

const Ranking = () => {
   const [type, setType] = useState(TABS.RANKING_PRIMARY)
   const [dataForStats, setDataForStats] = useState()
   const [allPlayers, setAllPlayers] = useState()
   const [currPlayers, setCurrPlayers] = useState()
   // Filters
   const [season, setSeason] = useState()
   const [userValue, setUserValue] = useState('')
   // Sound
   const { sound } = useContext(SoundContext)

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

   function filterPlayers(season) {
      const newCurrPlayers = []
      allPlayers.forEach((player) => {
         // Filter by season
         let gamesBySeason = player.games
         if (season !== 'lifetime') gamesBySeason = player.games.filter((game) => game.season === season)
         newCurrPlayers.push({ ...player, games: gamesBySeason })
      })
      setCurrPlayers(newCurrPlayers)
   }

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

   const handleClickRankingPrimary = () => {
      sound.btnGeneralClick.play()
      setType(TABS.RANKING_PRIMARY)
   }
   const handleClickRankingSecondary = () => {
      sound.btnGeneralClick.play()
      setType(TABS.RANKING_SECONDARY)
   }
   const handleClickRankingRules = () => {
      sound.btnGeneralClick.play()
      setType(TABS.RANKING_RULES)
   }

   return (
      <TabTypeContext.Provider value={{ type, setType }}>
         <PlayersContext.Provider value={{ currPlayers, setCurrPlayers }}>
            <DataContext.Provider value={{ dataForStats }}>
               <div className="tabs-container green-border center">
                  {currPlayers ? (
                     <>
                        <div
                           className={`stats three-tabs${type === TABS.RANKING_SECONDARY ? ' second-tab' : type === TABS.RANKING_RULES ? ' third-tab' : ''}`}
                           style={{ display: 'flex', justifyContent: 'center' }}
                        >
                           {/* Tabs */}
                           <div className="tabs">
                              <div className={`tab pointer${type === TABS.RANKING_PRIMARY ? ' active' : ''}`} onClick={handleClickRankingPrimary}>
                                 PRIMARY RANKING
                              </div>
                              <div className={`tab pointer${type === TABS.RANKING_SECONDARY ? ' active' : ''}`} onClick={handleClickRankingSecondary}>
                                 SECONDARY RANKING
                              </div>
                              <div className={`tab pointer${type === TABS.RANKING_RULES ? ' active' : ''}`} onClick={handleClickRankingRules}>
                                 RANKING RULES
                              </div>
                           </div>
                           {/* Data */}
                           {type === TABS.RANKING_PRIMARY && <RankingPrimary userValue={userValue} gamesCountForPrimaryRanking={GAMES_COUNT_PRIMARY_SEASON} />}
                           {type === TABS.RANKING_SECONDARY && <RankingSecondary userValue={userValue} />}
                           {type === TABS.RANKING_RULES && <RankingRules gamesCountForPrimaryRanking={GAMES_COUNT_PRIMARY_SEASON} />}
                        </div>
                        {/* Filters */}
                        <div className="filters" style={{ transform: 'translateX(-30%)' }}>
                           {type !== TABS.RANKING_RULES && (
                              <>
                                 <FilterSeason filterPlayers={filterPlayers} season={season} setSeason={setSeason} dataForStats={dataForStats} />
                                 <input type="text" className="filter filter-user" onChange={(e) => setUserValue(e.target.value)} placeholder="SEARCH PLAYER" />
                              </>
                           )}
                        </div>
                     </>
                  ) : (
                     // Loading Spinner
                     <div className="spinner">
                        <img className="full-size" src={spinner} alt="loading_spinner" />
                     </div>
                  )}
                  <BtnGoBack />
               </div>
            </DataContext.Provider>
         </PlayersContext.Provider>
      </TabTypeContext.Provider>
   )
}

export default Ranking
