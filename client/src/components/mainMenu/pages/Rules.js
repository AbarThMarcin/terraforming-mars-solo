import { PAGES } from '../../../data/pages'
import GoBack from '../GoBack'

const Rules = ({ setPage }) => {
   return (
      <div className="rules center">
         Rules
         <GoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Rules
