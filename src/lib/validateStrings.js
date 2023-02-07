const validateStreetName = str => {
        return ( str.match( /^(\d*\s*[A-Z]+)$/ ) ? true : false )
    },
    
    validateNumeric = str => {
        return ( str.match( /^\d+$/ ) ? true : false )

    },

    validateTaxPIDAtleast7 = str => {
        return ( ( str.match( /^[0-2]\d{6}[0-9]?([A-Z])?$/ ) || str.match( /^[0-2]\d{2}-\d{3}-\d{1}[0-9]?([A-Z])?$/ ) ) ? true : false ) 
    
    },

    validateCNumber = str => {
        return ( str.match( /^[0-2]\d{4}(C|c|)\d{2}$/ ) ? true : false )

    },

    validateTaxPID = str => {
        return ( str.match( /^[0-2]\d{7}([A-Z])?$/ ) ? true : false )  

    },
    
    validateGISID = str => {
        return ( str.match( /^[0-2]\d{4}(A|C|I|L|M|N|R|S|W|X|[0-9])\d{2}$/ ) ? true : false )
    
    }


export { validateStreetName, validateNumeric, validateTaxPIDAtleast7, validateCNumber, validateTaxPID, validateGISID }