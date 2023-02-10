import { redirect } from '@sveltejs/kit';
import { page } from "$app/stores"

/** @type {import('./$types').LayoutLoad} */
export const load = ( { route } ) => {
    if( route.id === "/othersearch" ){
        throw redirect( 307, '/othersearch/owner' );
    }
}