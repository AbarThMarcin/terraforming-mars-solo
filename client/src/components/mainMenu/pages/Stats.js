import { PAGES } from '../../../data/pages'
import GoBack from '../GoBack'

const Stats = ({ setPage }) => {
   return (
      <div className="stats center">
         Stats
         <GoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Stats
