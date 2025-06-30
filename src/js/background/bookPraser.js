'use strict';

async function getEpubMeta(payload){
    const meta = await getBookMetaFromReader(payload.bookName);
    return meta;
}
