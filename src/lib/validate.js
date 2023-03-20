const validateStreetName = str => {
    return ( str.match( /^(\d*\s*[A-Z]+)$/ ) ? true : false )
},

validateNumeric = str => {
    return ( str.match( /^\d+$/ ) ? true : false )

},

validateAtleast7= str => {
    return ( ( str.match( /^[0-2]\d{6}[0-9]?([A-Z])?$/ ) || str.match( /^[0-2]\d{2}-\d{3}-\d{1}[0-9]?([A-Z])?$/ ) ) ? true : false ) 

},

validateCNumber = str => {
    return ( str.match( /^[0-2]\d{4}(C|c)\d{2}$/ ) ? true : false )

},

validateTaxPID = str => {
    return ( str.match( /^[0-2]\d{7}([A-Z])?$/ ) ? true : false )  

},

validateGISID = str => {
    return ( str.match( /^[0-2]\d{4}(A|C|I|L|M|N|R|S|W|X|[0-9])\d{2}$/ ) ? true : false )

},

validateOnlyAlpha = str => {
    return ( str.match( /^[a-z]+$/i ) ? true : false )

},

validateIntersection = str => {
    return ( str.match( /^(\w+\s*){3}(AND|&)(\s*\w+){3}$/ ) ? true : false )

},

validateOwnerName = str => {
    return ( str.match( /^[A-Za-z]+\s*(,)\s*[A-Za-z]+$/ ) ? true : false )

},

validateForm = fields => {
    let valid = true

    Object.keys( fields ).forEach( field => {
        if( "rules" in fields[ field ] ){
            // Reset the previous error
            fields[ field ].error = null

            // Check rule and store text if its an error
            fields[ field ].rules.forEach( rule => {
                if( !fields[ field ].error ){
                    fields[ field ].error = rule( fields[ field ].val )
                
                }

            } )

            // Mark of invalid if an error message exisits
            valid = ( fields[ field ].error ? false : valid )

        }
        
    } )

    return { fields: fields, valid: valid }

}

export { validateStreetName, validateNumeric, validateAtleast7, validateCNumber, validateTaxPID, validateGISID, validateOnlyAlpha, validateOwnerName, validateIntersection, validateForm }