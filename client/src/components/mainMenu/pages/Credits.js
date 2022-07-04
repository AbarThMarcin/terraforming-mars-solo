import { PAGES } from '../../../data/pages'
import GoBack from '../GoBack'

const Credits = ({ setPage }) => {
   return (
      <div className="credits center">
         Credits
         <GoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Credits
