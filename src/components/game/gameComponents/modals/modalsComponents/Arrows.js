import arrowLeft from '../../../../../assets/images/other/arrowLeft.svg'
import arrowRight from '../../../../../assets/images/other/arrowRight.svg'

const Arrows = ({ page, setPage, pages }) => {
   const handleArrowClick = (e, side) => {
      e.stopPropagation()
      side === 'previous' ? setPage((page) => page - 1) : setPage((page) => page + 1)
   }

   return (
      <div className="cards-arrows center">
         {page > 1 && (
            <div className="cards-arrow pointer arrow-left" onClick={(e) => handleArrowClick(e, 'previous')}>
               <img className='center full-size' src={arrowLeft} alt="arrow_left" />
            </div>
         )}
         {page !== pages && (
            <div className="cards-arrow pointer arrow-right" onClick={(e) => handleArrowClick(e, 'next')}>
            <img className='center full-size' src={arrowRight} alt="arrow_right" />
            </div>
         )}
      </div>
   )
}

export default Arrows
