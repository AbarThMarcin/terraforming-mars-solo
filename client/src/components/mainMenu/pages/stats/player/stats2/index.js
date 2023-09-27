import { useMemo, useState } from 'react'
import { CARDS } from '../../../../../../data/cards'
import { range } from '../../../../../../utils/misc'
import { pad } from '../../../../../../utils/number'
import { LOG_TYPES } from '../../../../../../data/log/log'

const Stats2 = ({ currPlayer }) => {
   const [statCardId, setStatCardId] = useState(0)

   const percentages = useMemo(() => {
      const arr = []
      range(1, 14).forEach((gen) => {
         let counter = 0
         let counterAll = 0
         currPlayer.games.forEach((game) => {
            let currentGen
            game.logItems.forEach((logItem) => {
               if (logItem.type === LOG_TYPES.GENERATION) {
                  currentGen = parseInt(logItem.data.text)
               }
               if (logItem.type === LOG_TYPES.IMMEDIATE_EFFECT) {
                  if (statCardId === 0 || statCardId === CARDS.find((c) => c.name === logItem.data.text).id) {
                     counterAll++
                  }
                  if (currentGen === gen) {
                     if (statCardId === 0 || statCardId === CARDS.find((c) => c.name === logItem.data.text).id) {
                        counter++
                     }
                  }
               }
            })
         })
         if (counterAll) {
            arr.push([counter / counterAll, counter, counterAll])
         } else {
            arr.push(['-'])
         }
      })

      return arr
   }, [statCardId, currPlayer])

   const points = useMemo(() => {
      let gamesCounter = 0
      let arr = new Array(14).fill(0)
      currPlayer.games.forEach((game) => {
         gamesCounter++
         let currentGen
         game.logItems.forEach((logItem, idx) => {
            if (logItem.type === LOG_TYPES.GENERATION) currentGen = parseInt(logItem.data.text)
            if (logItem.type === LOG_TYPES.PASS) {
               arr[currentGen - 1] += logItem.details.stateAfter.statePlayer.totalPoints
            } else if (logItem.type === LOG_TYPES.FINAL_CONVERT_PLANTS) {
               arr[currentGen - 1] += game.logItems[idx].details.stateAfter.statePlayer.totalPoints - game.logItems[idx - 1].details.stateAfter.statePlayer.totalPoints
            }
         })
      })
      // if (gamesCounter) arr.forEach((gen) => (gen = gen / gamesCounter))
      if (gamesCounter > 0) arr = arr.map((gen) => (gen = gen / gamesCounter))
      return arr
   }, [currPlayer])

   function handleClick(e) {
      setStatCardId(parseInt(e.target.value))
   }

   const Percentage = ({ percentages, id }) => {
      const perc = percentages[15 - id - 1][0] * 100
      const percInt = Math.floor(perc)
      const percDec = pad(Math.floor((perc % 1) * 100).toFixed(0), 2)

      const played = percentages[15 - id - 1][1]
      const playedAll = percentages[15 - id - 1][2]
      const gen = 15 - id
      const isZero = played === 0

      const max = Math.max(...percentages.map((p) => p[1]))
      return (
         <div
            style={{ background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,255,150,${(0.2 * (played / max) ** 1.6).toFixed(2)}) 50%, rgba(0,0,0,0) 100%)` }}
            className={`stats2-percentages-line ${isZero ? 'is-zero' : ''}`}
         >
            <span>{gen}</span>
            <span>.</span>
            <span>{isZero ? 0 : percInt}</span>
            <span>.</span>
            <span>
               {isZero ? '00' : percDec}
               <span>%</span>
            </span>
            {!isZero && (
               <>
                  <span>(</span>
                  <span>{played}</span>
                  <span>&nbsp;/&nbsp;</span>
                  <span>{playedAll}</span>
                  <span>)</span>
               </>
            )}
         </div>
      )
   }
   const max = useMemo(() => {
      let maxValue = 0

      for (let i = 1; i < points.length; i++) {
         if (points[i] - points[i - 1] > maxValue) maxValue = points[i] - points[i - 1]
      }

      return maxValue
   }, [points])

   const Point = ({ points, id }) => {
      const point = points[15 - id - 1]
      const pointInt = Math.floor(point)
      const pointDec = pad(Math.floor((point % 1) * 100).toFixed(0), 2)
      const gen = 15 - id

      let current = 0
      if (id < 14) {
         current = point - points[15 - id - 2]
      } else {
         current = point - 14
      }

      return (
         <div
            style={{
               background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,255,150,${(0.2 * (current / max) ** 1.6).toFixed(2)}) 50%, rgba(0,0,0,0) 100%)`,
               width: 'calc(var(--default-size) * 9.5)',
            }}
            className="stats2-percentages-line"
         >
            <span style={{ width: 'calc(var(--default-size) * 2.4)' }}>{gen}</span>
            <span>.</span>
            <span style={{ width: 'calc(var(--default-size) * 1.6)' }}>{pointInt}</span>
            <span>.</span>
            <span>{point ? pointDec : '00'}</span>
            {current !== 0 ? <span>({current < 0 ? '' : '+' }{current.toFixed(2)})</span> : ''}
         </div>
      )
   }

   const GetGamesCount = () => {
      let gamesCount = 0
      currPlayer.games.forEach((game) => {
         if (game.logItems[0].details !== undefined) gamesCount++
      })

      const res = gamesCount ? ` (${gamesCount} GAME${gamesCount > 1 ? 'S' : ''})` : ''

      return res
   }

   return (
      <div className="details">
         <div className="player-name">{currPlayer.name}</div>
         <div className="stats2-box center">
            <div>
               <div>CARD PLAYABILITY PER GENERATION</div>
               <select style={{ marginLeft: '0' }} className="filter filter-season-corp pointer" defaultValue={0} onChange={handleClick}>
                  <option value={0}>ALL CARDS</option>
                  {CARDS.map((card, idx) => (
                     <option key={idx} value={card.id}>
                        ({card.id}) {card.name}
                     </option>
                  ))}
               </select>
               <div>
                  {percentages[0][0] !== '-' ? range(1, 14).map((id) => <Percentage key={15 - id} percentages={percentages} id={id} />) : <span>CARD HAS NEVER BEEN PLAYED</span>}
               </div>
            </div>
            <div>
               <div style={{ lineHeight: 'calc(var(--default-size) * 1.1)', width: 'calc(var(--default-size) * 11)' }}>
                  AVERAGE TOTAL POINTS AFTER
                  <br />
                  EACH GENERATION{<GetGamesCount />}
               </div>
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%', height: '100%' }}>
                  {points[0] !== 0 ? range(1, 14).map((id) => <Point key={15 - id} points={points} id={id} />) : <span>NO GAMES</span>}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Stats2
