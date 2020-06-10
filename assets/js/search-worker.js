// Copyright (c) 2020 Florian Klampfer <https://qwtel.com/>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

importScripts('/assets/js/kv-storage-polyfill/dist/kv-storage-polyfill.umd.js');
self.storage = kvStoragePolyfill.default;
self.StorageArea = kvStoragePolyfill.StorageArea;

const DATA_URL = '/assets/data.json';

const uniqBy = (xs, k) => [...new Map(xs.map(x => [x[k], x])).values()];

function forAwait(asyncIter, f) {
  return asyncIter.next().then(({ done, value }) => {
    if (done) return;
    f(value);
    return forAwait(asyncIter, f);
  });
}

async function getDocuments() {
  const { pages = [], documents = [] } = await fetch(DATA_URL).then(x => x.json());
  const siteData = [
    ...pages,
    ...documents.map((doc) => {
      if (doc.date) doc.date = new Date(doc.date);
      return doc;
    }),
  ];
  const docs = uniqBy(siteData, 'url');
  // const documentMap = new Map(siteData.map(({ url, content, description, ...document }) => [url, {
  //   ...document,
  //   url, 
  //   description: description || content.substr(0, 160),
  // }]));
  return docs;
}

///////////////////////////////////////////////////////////////////////////////
// Mini Search 
///////////////////////////////////////////////////////////////////////////////

importScripts('/assets/js/minisearch/dist/umd/index.min.js');
const INDEX_KEY = 'index--2020-06-10T10:26:47+07:00';
const storage = new StorageArea('mini-search/');

const OPTIONS = {
  idField: 'url',
  fields: ['title', 'content', 'description', 'categories', 'tags', 'keywords'],
  storeFields: ['url', 'title', 'description', 'image'],
  extractField: (document, fieldName) => {
    const value = document[fieldName];
    return Array.isArray(value) ? value.join(' ') : value;
  }
};

(async () => {
  const indexData = await storage.get(INDEX_KEY);
  let miniSearch;

  if (indexData) {
    miniSearch = MiniSearch.loadJS(indexData, OPTIONS);
  } else {
    miniSearch = new MiniSearch(OPTIONS);

    miniSearch.addAll(await getDocuments());

    (async () => {
      // Delete old indices
      const oldKeys = [];
      await forAwait(storage.keys(), (key) => { if (key !== INDEX_KEY) oldKeys.push(key); });
      await Promise.all(oldKeys.map(oldKey => storage.delete(oldKey)));

      // Store new index
      await storage.set(INDEX_KEY, miniSearch.toJSON());
    })();
  }

  addEventListener('message', ({ data, ports: [port] }) => {
    const results = miniSearch.search(data, {
      boost: { title: 5, description: 2, categories: 2, tags: 2, keywords: 2 },
      prefix: true,
      fuzzy: 0.25,
      combineWith: "AND",
    });
    port.postMessage(results.slice(0, 20));
  });
})();

///////////////////////////////////////////////////////////////////////////////
// Lunr
///////////////////////////////////////////////////////////////////////////////

// // TODO: Multi language
// importScripts(
//   '/assets/bower_components/lunr/lunr.js', 
//   '/assets/bower_components/lunr-languages/lunr.stemmer.support.js', 
//   '/assets/bower_components/lunr-languages/lunr.de.js',
// );

// const INDEX_KEY = 'index--2020-06-10T10:26:47+07:00';
// const storage = new StorageArea('lunr/');

// // TODO: update index
// (async () => {
//   let { indexData, documentMap } = await storage.get(INDEX_KEY) || {};
//   let index;

//   if (indexData && documentMap) {
//     index = lunr.Index.load(indexData);
//   } else {
//     const [documents, dm] = await getDocuments();
//     documentMap = dm;
//     index = lunr(function () {
//       this.ref('url');
//       this.field('title');
//       this.field('content');
//       this.field('description');
//       this.field('categories');
//       this.field('tags');

//       documents.forEach(({ categories, tags, ...doc }) => this.add({
//         ...doc,
//         ...categories ? { categories: categories.join() } : {},
//         ...tags ? { tags: tags.join() } : {},
//       }));
//     });

//     // delete old indices
//     const oldKeys = [];
//     await forAwait(storage.keys(), (key) => { if (key !== INDEX_KEY) oldKeys.push(key); });
//     await Promise.all(oldKeys.map(oldKey => storage.delete(oldKey)));

//     // store new index
//     await storage.set(INDEX_KEY, {
//       indexData: index.toJSON(),
//       documentMap,
//     });
//   }

//   addEventListener('message', ({ data, ports: [port] }) => {
//     const results = data !== '' ? index.search(data) : [];
//     port.postMessage(results.map(({ ref }) => documentMap.get(ref)));
//   });
// })();


///////////////////////////////////////////////////////////////////////////////
// js-search 
///////////////////////////////////////////////////////////////////////////////

// importScripts('/assets/bower_components/js-search/dist/umd/js-search.js');
// ;(async () => {
//   const [documents] = await getDocuments();

//   const jsSearch = new JsSearch.Search('url');
//   jsSearch.addIndex('title');
//   jsSearch.addIndex('description');
//   jsSearch.addIndex('content');
//   // search.addIndex('categories');
//   // search.addIndex('tags');

//   jsSearch.addDocuments(documents);

//   addEventListener('message', ({ data, ports: [port] }) => {
//     const results = jsSearch.search(data);
//     // console.log(results);
//     port.postMessage(results);
//   });
// })();

///////////////////////////////////////////////////////////////////////////////
// Flex Search
///////////////////////////////////////////////////////////////////////////////

// importScripts('https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch/dist/flexsearch.compact.js');
// ;(async () => {
//   const index = new FlexSearch({
//     doc: {
//       id: 'url',
//       field: ['title' , 'content', 'description'],
//       store: ['title' , 'description', 'image', 'url'],
//     },
//     // async: true,
//   });

//   const [documents] = await getDocuments();
//   // console.log(documents)
//   index.add(documents);

//   addEventListener('message', ({ data, ports: [port] }) => {
//     const results = index.search(data);
//     // console.log(results);
//     port.postMessage(results);
//   });
// })();

