import { memo, useContext, useMemo } from 'react'
import { DataContext } from '../Stats'
import { CORP_NAMES } from '../../../../../data/corpNames'

const FilterCorp = ({ filterPlayers, season, setCorp, userValue }) => {
   const { data } = useContext(DataContext)
   const corps = useMemo(() => ['ALL CORPORATIONS', ...getCorps()], [])

   function getCorps() {
      return Object.values(CORP_NAMES)
   }

   function handleClick(e) {
      setCorp(e.target.value)
      filterPlayers(season, e.target.value, userValue)
   }

   return (
      <select
         className="filter filter-season-corp pointer"
         defaultValue={data.season}
         onChange={handleClick}
      >
         {corps.map((corp, idx) => (
            <option key={idx} value={corp}>
               {corp}
            </option>
         ))}
      </select>
   )
}

export default memo(FilterCorp)
