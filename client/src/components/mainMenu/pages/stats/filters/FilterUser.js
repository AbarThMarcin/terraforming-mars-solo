import { memo } from 'react'

const FilterUser = ({ filterPlayers, season, corp, userValue, setUserValue }) => {
   function handleOnChange(e) {
      setUserValue(e.target.value)
      filterPlayers(season, corp, e.target.value)
   }

   return (
      <input
         type="text"
         className="filter filter-user"
         value={userValue}
         onChange={handleOnChange}
         placeholder="SEARCH PLAYER"
      />
   )
}

export default memo(FilterUser)
