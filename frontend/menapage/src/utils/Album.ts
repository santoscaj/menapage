
export interface Foto {
    id        : number
    filename  : string
    date      : null | Date
    visited   : boolean
    albumId   : number
    prize     ?: boolean
    caption   : string
    createdAt : null | Date
    updatedAt : null | Date
}

export function emptyFoto() : Foto{
    return {
        id        : 0,
        filename  : '',
        date      : null,
        visited   : false,
        albumId   : 0,
        caption   : '',
        createdAt : null,
        updatedAt : null 
    }
}

export interface Album {
    id        : number
    dirname   : string
    name      : null | string
    day       : number
    createdAt : null | Date 
    updatedAt : null | Date 
    fotos     : Foto[]
}

export function emptyAlbum() : Album{
    return {
        id        : 0,
        dirname   : '',
        name      : null,
        day       : 0,
        createdAt : null ,
        updatedAt : null ,
        fotos     : [],
    }
}

