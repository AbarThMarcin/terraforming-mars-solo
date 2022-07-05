import { PAGES } from '../../../data/pages'
import BtnGoBack from '../BtnGoBack'

const Account = ({ setPage }) => {
   return (
      <div className="account center">
         Account
         <BtnGoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Account
