const CardMlnToBuy = ({ toBuyMln, disabled }) => {
   return <div className={`card-to-buy-mln ${disabled && 'disabled'}`}>{toBuyMln}</div>
}

export default CardMlnToBuy
