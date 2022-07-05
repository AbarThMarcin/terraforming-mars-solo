import { PAGES } from '../../../data/pages'
import BtnGoBack from '../BtnGoBack'

const Credits = ({ setPage }) => {
   return (
      <div className="credits center">
         Credits
         <BtnGoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Credits
