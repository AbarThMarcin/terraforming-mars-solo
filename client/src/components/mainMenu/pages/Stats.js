import { PAGES } from '../../../data/pages'
import BtnGoBack from '../BtnGoBack'

const Stats = ({ setPage }) => {
   return (
      <div className="stats center">
         Stats
         <BtnGoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Stats
