import { PAGES } from '../../../data/pages'
import BtnGoBack from '../BtnGoBack'

const Rules = ({ setPage }) => {
   return (
      <div className="rules center">
         Rules
         <BtnGoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Rules
