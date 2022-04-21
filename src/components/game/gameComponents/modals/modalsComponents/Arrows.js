const Arrows = ({ page, setPage, pages }) => {
   const handleArrowClick = (e, side) => {
      e.stopPropagation()
      side === 'previous' ? setPage((page) => page - 1) : setPage((page) => page + 1)
   }

   return (
      <div className="arrows center">
         {page > 1 && (
            <div className="arrow pointer arrow-left" onClick={(e) => handleArrowClick(e, 'previous')}>
               LEFT ARROW
            </div>
         )}
         {page !== pages && (
            <div className="arrow pointer arrow-right" onClick={(e) => handleArrowClick(e, 'next')}>
               RIGHT ARROW
            </div>
         )}
      </div>
   )
}

export default Arrows
