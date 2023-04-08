const formatCommas = ( num, decimals = 0 ) => {
		if( num === null || isNaN( num ) ) 
			return "N/A"

		return parseFloat( num ).toLocaleString( "en-US", { maximumFractionDigits: decimals, } )

	},
	formatMoney = num => {
  		if( num === null || isNaN( num ) ) 
			return "N/A"

  		return parseFloat( num ).toLocaleString( "en-US", { style: "currency", currency: "USD", } )

	},
	formatDate = dateString => {
  		let date = new Date( dateString )
  		
		return date.toLocaleDateString( "en-US" )

	}

export { formatCommas, formatMoney, formatDate }