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
      const arr = []
      range(1, 14).forEach((gen) => {
         let average = 0
         currPlayer.games.forEach((game) => {
            let currentGen
            game.logItems.forEach((logItem) => {
               if (logItem.type === LOG_TYPES.GENERATION) {
                  currentGen = parseInt(logItem.data.text)
               }
               if (logItem.type === LOG_TYPES.PASS && currentGen === gen) {

               }
            })
         })
         arr.push(average)
      })

      return arr
   }, [statCardId, currPlayer])

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

   const Point = ({ percentages, id }) => {
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
               <div style={{ lineHeight: 'calc(var(--default-size) * 1.1)' }}>AVERAGE TOTAL POINTS<br />AFTER EACH GENERATION</div>
               <div>
                  {points[0] !== '-' ? range(1, 14).map((id) => <Point key={15 - id} percentages={percentages} id={id} />) : <span>CARD HAS NEVER BEEN PLAYED</span>}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Stats2
