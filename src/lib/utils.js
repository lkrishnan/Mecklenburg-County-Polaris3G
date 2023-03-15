const null2empty = inp => {
    return ( ( !inp || ( typeof inp === "undefined" ) ) ? "" : inp.trim( ) ) 

},
removeArrayDups = arr => {
    return arr.reduce( ( unique, item ) => ( unique.includes( item ) ? unique : [ ...unique, item ] ), [ ], )

},
srchstr2qrystr = str => {
    return str.replace(/\s/g, "+").toLowerCase( )

},
qrystr2srchstr = str => {
    return str.replace( /\+/g, " " ).toUpperCase( )

},
filterObj = ( theobj, allowed ) => {
    return Object.keys( theobj )
            .filter( key => allowed.includes( key ) )
            .reduce( ( obj, key ) => { obj[ key ] = theobj[ key ]; return obj; }, { } )

} 

export { null2empty, removeArrayDups, srchstr2qrystr, qrystr2srchstr, filterObj }