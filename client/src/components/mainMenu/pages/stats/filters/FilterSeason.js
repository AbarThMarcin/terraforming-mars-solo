import { memo, useMemo } from 'react'

const FilterSeason = ({ filterPlayers, season, setSeason, corp, userValue, dataForStats }) => {
   const seasons = useMemo(
      () => getSeasons(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   )

   function getSeasons() {
      return Array(dataForStats.season + 1)
         .fill()
         .map((_, idx) => dataForStats.season - idx)
   }

   function handleClick(e) {
      const newSeason = e.target.value === 'lifetime' ? 'lifetime' : parseInt(e.target.value)
      setSeason(newSeason)
      filterPlayers(newSeason, userValue, corp)
   }

   return (
      <select className="filter filter-season-corp pointer" defaultValue={season} onChange={handleClick}>
         <option value="lifetime">LIFETIME</option>
         {seasons.map((season, idx) => (
            <option key={idx} value={season}>
               {season === 0 ? 'PRESEASON' : `SEASON ${season}`}
            </option>
         ))}
      </select>
   )
}

export default memo(FilterSeason)
