import { PAGES } from '../../../data/pages'
import GoBack from '../GoBack'

const Account = ({ setPage }) => {
   return (
      <div className="account center">
         Account
         <GoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Account
