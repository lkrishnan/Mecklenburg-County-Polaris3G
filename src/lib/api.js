const genError = err => {
    return { "statusCode":500, "error": "Internal Server Error", ...err }
        
    },
    getInvalidParams = ( params, allowed ) => {
        console.log( params, allowed )
        return Array.from( params )
                .map( param => ( allowed.includes( param[ 0 ] ) ? null :  `${param[ 0 ]}=${param[ 1 ]}` ) )
                .filter( n => n )

    },
    getErrorMsg = ( params, allowed ) => {
        if( Array.from( params ).length > 0 ){
            const invalid_params = getInvalidParams( params, allowed ).join( ', ' )

            return `invalid paramater(s) sent: ${invalid_params}`

        }else 
            return "No parameters were sent"

    }

export { genError, getInvalidParams, getErrorMsg }