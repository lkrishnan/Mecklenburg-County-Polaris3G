const null2empty = inp => {
    return ( ( !inp || ( typeof inp === "undefined" ) ) ? "" : inp.trim( ) ) 

},
removeArrayDups = arr => {
    return arr.reduce( ( unique, item ) => ( unique.includes( item ) ? unique : [ ...unique, item ] ), [ ], )

}

export { null2empty, removeArrayDups }