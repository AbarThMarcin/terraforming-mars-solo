import { useMemo, useState } from 'react'
import { CARDS } from '../../../../../../data/cards'
import { range } from '../../../../../../utils/misc'
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
      const perc = `${(percentages[15 - id - 1][0] * 100).toFixed(2)}%`
      const played = percentages[15 - id - 1][1]
      const playedAll = percentages[15 - id - 1][2]
      const gen = 15 - id
      const isZero = played === 0

      return <span>{isZero ? `${gen}. 0%` : `${gen}. ${perc} (${played}/${playedAll})`}</span>
   }

   return (
      <div className="details">
         <div className="player-name">{currPlayer.name}</div>
         <div className="stats2-box center">
            <div>
               <div>CARD PLAYABILITY PER GENERATION</div>
               <select className="filter filter-season-corp pointer" defaultValue={0} onChange={handleClick}>
                  <option value={0}>ALL CARDS</option>
                  {CARDS.map((card, idx) => (
                     <option key={idx} value={card.id}>
                        ({card.id}) {card.name}
                     </option>
                  ))}
               </select>
               <div>
                  {percentages[0][0] !== '-' ? (
                     range(1, 14).map((id) => (
                        <div key={15 - id}>
                           <Percentage percentages={percentages} id={id} />
                        </div>
                     ))
                  ) : (
                     <span>CARD HAS NEVER BEEN PLAYED</span>
                  )}
               </div>
            </div>
            <div>
               <div>AVERAGE TOTAL POINTS AFTER EACH GENERATION</div>
               <select className="filter filter-season-corp pointer" defaultValue={0} onChange={handleClick}>
                  <option value={0}>ALL CARDS</option>
                  {CARDS.map((card, idx) => (
                     <option key={idx} value={card.id}>
                        ({card.id}) {card.name}
                     </option>
                  ))}
               </select>
               <div>
                  {percentages[0][0] !== '-' ? (
                     range(1, 14).map((id) => (
                        <div key={15 - id}>
                           {/* {15 - id}. {(percentages[15 - id - 1][0] * 100).toFixed(2)}% ({percentages[15 - id - 1][1]}/{percentages[15 - id - 1][2]}) */}
                           <Percentage percentages={percentages} id={id} />
                        </div>
                     ))
                  ) : (
                     <span>CARD HAS NEVER BEEN PLAYED</span>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Stats2
