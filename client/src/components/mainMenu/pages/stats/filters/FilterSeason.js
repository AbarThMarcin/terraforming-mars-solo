import { memo, useContext, useMemo } from 'react'
import { DataContext } from '../Stats'

const FilterSeason = ({ filterPlayers, season, setSeason, corp, userValue }) => {
   const { data } = useContext(DataContext)
   const seasons = useMemo(() => getSeasons(), [])

   function getSeasons() {
      return Array(data.season)
         .fill()
         .map((_, idx) => data.season - idx)
   }

   function handleClick(e) {
      const newSeason = e.target.value === 'lifetime' ? 'lifetime' : parseInt(e.target.value)
      setSeason(newSeason)
      filterPlayers(newSeason, corp, userValue)
   }

   return (
      <select
         className="filter filter-season-corp pointer"
         defaultValue={season}
         onChange={handleClick}
      >
         <option value="lifetime">LIFETIME</option>
         {seasons.map((season, idx) => (
            <option key={idx} value={season}>
               SEASON {season}
            </option>
         ))}
      </select>
   )
}

export default memo(FilterSeason)
