const genError = err => {
    return { "statusCode":500, "error": "Internal Server Error", ...err }
        
    },
    getInvalidParams = ( params, allowed ) => {
        return Array.from( params )
                .map( param => ( allowed.includes( param[ 0 ] ) ? null :  `${param[ 0 ]}=${param[ 1 ]}` ) )
                .filter( n => n )

    }

export { genError, getInvalidParams }