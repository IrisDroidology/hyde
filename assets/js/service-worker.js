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

// ⚡️ DANGER ZONE ⚡️
// ================
// 

// The shell cache keeps "landmark" resources, like CSS and JS, web fonts, etc.
// which won't change between content updates.
// 
// 
const SHELL_CACHE = "shell-9.0.0-alpha.13--v7--sw/";

// A separate assets cache that won't be invalidated when there's a newer version of Hydejack.
// NOTE: Whenever you make changes to any of the files in yor `assets` folder,
//       increase the cache number, otherwise the changes will *never* be visible to returning visitors.
const ASSETS_CACHE = "assets--v7--sw/";

// The cache for regular content, which will be invalidated every time you make a new build.
const CONTENT_CACHE = "content--2020-06-10T10:26:47+07:00--sw/";

// A URL search parameter you can add to external assets to cache them in the service worker.
const CACHE_SEARCH_PARAM = "sw-cache";

// The regular expression used to find URLs in webfont style sheets.
const RE_CSS_URL = /url\(['"]?(.*?)['"]?\)/gi;

const ICON_FONT = "/assets/icomoon/style.css";
const KATEX_FONT = "/assets/bower_components/katex/dist/katex.min.css";

// 
// 

const SHELL_FILES = [
  "/assets/css/hydejack-9.0.0-alpha.13.css",
  "/assets/js/service-worker.js",
  "/assets/js/search-worker.js",
];

const STATIC_FILES = [
  /**/"/.well-known/keybase.txt",
  /**/"/CNAME",
  /**/"/assets/Resume.pdf",
  /**/"/assets/Thesis.pdf",
  /**/"/assets/icons/favicon.ico",
  /**/"/assets/icons/icon.png",
  /**/"/assets/icons/icon@0,25x.png",
  /**/"/assets/icons/icon@0,5x.png",
  /**/"/assets/icons/icon@0,75x.png",
  /**/"/assets/icons/icon@2x.png",
  /**/"/assets/icons/icon@3x.png",
  /**/"/assets/icons/tile-large.png",
  /**/"/assets/icons/tile-medium.png",
  /**/"/assets/icons/tile-small.png",
  /**/"/assets/icons/tile-wide.png",
  /**/"/assets/img/Fessenden_synchronous_spark_transmitter.jpg",
  /**/"/assets/img/Peter_Paul_Rubens_Massacre_of_the_Innocents.jpg",
  /**/"/assets/img/a-new-kind-of-money.jpg",
  /**/"/assets/img/aoc.png",
  /**/"/assets/img/async-constructor.png",
  /**/"/assets/img/blk.jpg",
  /**/"/assets/img/cov.png",
  /**/"/assets/img/ducky-hunting-1.jpg",
  /**/"/assets/img/ducky-hunting-2.jpg",
  /**/"/assets/img/ducky-hunting-bg.jpg",
  /**/"/assets/img/fotg-wild.png",
  /**/"/assets/img/fotg-wild@2x.png",
  /**/"/assets/img/fotg.png",
  /**/"/assets/img/fotg@2x.png",
  /**/"/assets/img/github-url.png",
  /**/"/assets/img/hy-drawer.svg",
  /**/"/assets/img/hy-img.svg",
  /**/"/assets/img/hy-push-state.svg",
  /**/"/assets/img/hy.svg",
  /**/"/assets/img/inap-comic-sans.png",
  /**/"/assets/img/inap-times.png",
  /**/"/assets/img/javascript.svg",
  /**/"/assets/img/jekyll.svg",
  /**/"/assets/img/js16-9.svg",
  /**/"/assets/img/jsn.jpg",
  /**/"/assets/img/kings.png",
  /**/"/assets/img/marbles.png",
  /**/"/assets/img/marbles@0,5x.png",
  /**/"/assets/img/mct.jpg",
  /**/"/assets/img/me.jpg",
  /**/"/assets/img/me@2x.jpg",
  /**/"/assets/img/me@4x.jpg",
  /**/"/assets/img/npm-url.png",
  /**/"/assets/img/projects/base-blue.jpg",
  /**/"/assets/img/projects/base-blue@0,25x.jpg",
  /**/"/assets/img/projects/base-blue@0,5x.jpg",
  /**/"/assets/img/projects/base-brown.jpg",
  /**/"/assets/img/projects/base-brown@0,25x.jpg",
  /**/"/assets/img/projects/base-brown@0,5x.jpg",
  /**/"/assets/img/projects/base-cyan.jpg",
  /**/"/assets/img/projects/base-cyan@0,25x.jpg",
  /**/"/assets/img/projects/base-cyan@0,5x.jpg",
  /**/"/assets/img/projects/base-green.jpg",
  /**/"/assets/img/projects/base-green@0,25x.jpg",
  /**/"/assets/img/projects/base-green@0,5x.jpg",
  /**/"/assets/img/projects/base-magenta.jpg",
  /**/"/assets/img/projects/base-magenta@0,25x.jpg",
  /**/"/assets/img/projects/base-magenta@0,5x.jpg",
  /**/"/assets/img/projects/base-orange.jpg",
  /**/"/assets/img/projects/base-orange@0,25x.jpg",
  /**/"/assets/img/projects/base-orange@0,5x.jpg",
  /**/"/assets/img/projects/base-red.jpg",
  /**/"/assets/img/projects/base-red@0,25x.jpg",
  /**/"/assets/img/projects/base-red@0,5x.jpg",
  /**/"/assets/img/projects/base-yellow.jpg",
  /**/"/assets/img/projects/base-yellow@0,25x.jpg",
  /**/"/assets/img/projects/base-yellow@0,5x.jpg",
  /**/"/assets/img/projects/blocky-blocks-poster.jpg",
  /**/"/assets/img/projects/blocky-blocks-poster@0,5x.jpg",
  /**/"/assets/img/projects/blocky-blocks.jpg",
  /**/"/assets/img/projects/blocky-blocks@0,25x.jpg",
  /**/"/assets/img/projects/blocky-blocks@0,5x.jpg",
  /**/"/assets/img/projects/cash-with-friends.png",
  /**/"/assets/img/projects/cash-with-friends@0,25x.png",
  /**/"/assets/img/projects/cash-with-friends@0,5x.png",
  /**/"/assets/img/projects/default.jpg",
  /**/"/assets/img/projects/default@0,25x.jpg",
  /**/"/assets/img/projects/default@0,5x.jpg",
  /**/"/assets/img/projects/ducky-hunting.png",
  /**/"/assets/img/projects/ducky-hunting@0,5x.png",
  /**/"/assets/img/projects/github-language-graph.png",
  /**/"/assets/img/projects/github-language-graph@0,25x.png",
  /**/"/assets/img/projects/github-language-graph@0,5x.png",
  /**/"/assets/img/projects/hyde-v1.jpg",
  /**/"/assets/img/projects/hyde-v1.png",
  /**/"/assets/img/projects/hyde-v1@0,25x.jpg",
  /**/"/assets/img/projects/hyde-v1@0,25x.png",
  /**/"/assets/img/projects/hyde-v1@0,5x.jpg",
  /**/"/assets/img/projects/hyde-v1@0,5x.png",
  /**/"/assets/img/projects/hyde-v2.jpg",
  /**/"/assets/img/projects/hyde-v2.png",
  /**/"/assets/img/projects/hyde-v2@0,25x.jpg",
  /**/"/assets/img/projects/hyde-v2@0,25x.png",
  /**/"/assets/img/projects/hyde-v2@0,5x.jpg",
  /**/"/assets/img/projects/hyde-v2@0,5x.png",
  /**/"/assets/img/projects/hyde.jpg",
  /**/"/assets/img/projects/hyde@0,25x.jpg",
  /**/"/assets/img/projects/hyde@0,5x.jpg",
  /**/"/assets/img/projects/hydejack-8.jpg",
  /**/"/assets/img/projects/hydejack-8@0,25x.jpg",
  /**/"/assets/img/projects/hydejack-8@0,5x.jpg",
  /**/"/assets/img/projects/hydejack-v3.jpg",
  /**/"/assets/img/projects/hydejack-v3@0,25x.jpg",
  /**/"/assets/img/projects/hydejack-v3@0,5x.jpg",
  /**/"/assets/img/projects/hydejack-v4.jpg",
  /**/"/assets/img/projects/hydejack-v4@0,25x.jpg",
  /**/"/assets/img/projects/hydejack-v4@0,5x.jpg",
  /**/"/assets/img/projects/hydejack-v5.jpg",
  /**/"/assets/img/projects/hydejack-v5@0,25x.jpg",
  /**/"/assets/img/projects/hydejack-v5@0,5x.jpg",
  /**/"/assets/img/projects/hydejack-v6.jpg",
  /**/"/assets/img/projects/hydejack-v6@0,25x.jpg",
  /**/"/assets/img/projects/hydejack-v6@0,5x.jpg",
  /**/"/assets/img/projects/hydejack-v7.jpg",
  /**/"/assets/img/projects/hydejack-v7@0,25x.jpg",
  /**/"/assets/img/projects/hydejack-v7@0,5x.jpg",
  /**/"/assets/img/projects/kelly.png",
  /**/"/assets/img/projects/kelly@0,25x.png",
  /**/"/assets/img/projects/kelly@0,5x.png",
  /**/"/assets/img/projects/kings.png",
  /**/"/assets/img/projects/kings@0,25x.png",
  /**/"/assets/img/projects/kings@0,5x.png",
  /**/"/assets/img/projects/meta.jpg",
  /**/"/assets/img/projects/meta@0,25x.jpg",
  /**/"/assets/img/projects/meta@0,5x.jpg",
  /**/"/assets/img/projects/modern-webgl.png",
  /**/"/assets/img/projects/modern-webgl@0,125x.png",
  /**/"/assets/img/projects/modern-webgl@0,25x.png",
  /**/"/assets/img/projects/modern-webgl@0,5x.png",
  /**/"/assets/img/projects/oldschool.jpg",
  /**/"/assets/img/projects/oldschool@0,25x.jpg",
  /**/"/assets/img/projects/oldschool@0,5x.jpg",
  /**/"/assets/img/projects/onescore-logo.png",
  /**/"/assets/img/projects/onescore.png",
  /**/"/assets/img/projects/onescore@0,25x.png",
  /**/"/assets/img/projects/onescore@0,5x.png",
  /**/"/assets/img/projects/pretentious.jpg",
  /**/"/assets/img/projects/pretentious@0,25x.jpg",
  /**/"/assets/img/projects/pretentious@0,5x.jpg",
  /**/"/assets/img/projects/quest-text-reader.png",
  /**/"/assets/img/projects/quest-text-reader@0,25x.png",
  /**/"/assets/img/projects/quest-text-reader@0,5x.png",
  /**/"/assets/img/projects/stringer-bell.png",
  /**/"/assets/img/projects/stringer-bell@0,25x.png",
  /**/"/assets/img/projects/stringer-bell@0,5x.png",
  /**/"/assets/img/projects/thesis-3.png",
  /**/"/assets/img/projects/thesis-3@0,25x.png",
  /**/"/assets/img/projects/thesis-3@0,5x.png",
  /**/"/assets/img/projects/toss.png",
  /**/"/assets/img/projects/toss@0,25x.png",
  /**/"/assets/img/projects/toss@0,5x.png",
  /**/"/assets/img/projects/twittle-triad.png",
  /**/"/assets/img/projects/typonotes.png",
  /**/"/assets/img/projects/typonotes@0,25x.png",
  /**/"/assets/img/projects/typonotes@0,5x.png",
  /**/"/assets/img/projects/weights.png",
  /**/"/assets/img/projects/weights@0,25x.png",
  /**/"/assets/img/projects/weights@0,5x.png",
  /**/"/assets/img/projects/wilson.svg",
  /**/"/assets/img/projects/wisp.png",
  /**/"/assets/img/projects/wisp@0,25x.png",
  /**/"/assets/img/projects/wisp@0,5x.png",
  /**/"/assets/img/projects/wkpda.png",
  /**/"/assets/img/python.svg",
  /**/"/assets/img/ruby.svg",
  /**/"/assets/img/serverless.svg",
  /**/"/assets/img/stencil.svg",
  /**/"/assets/img/ts16-9.svg",
  /**/"/assets/img/web-crypto-2.png",
  /**/"/assets/img/webcomp-vs-react.png",
  /**/"/assets/.DS_Store",
  /**/"/assets/bower.json",
  /**/"/assets/bower_components/html5shiv/.bower.json",
  /**/"/assets/bower_components/html5shiv/Gruntfile.js",
  /**/"/assets/bower_components/html5shiv/bower.json",
  /**/"/assets/bower_components/html5shiv/dist/html5shiv-printshiv.js",
  /**/"/assets/bower_components/html5shiv/dist/html5shiv-printshiv.min.js",
  /**/"/assets/bower_components/html5shiv/dist/html5shiv.js",
  /**/"/assets/bower_components/html5shiv/dist/html5shiv.min.js",
  /**/"/assets/bower_components/html5shiv/package.json",
  /**/"/assets/bower_components/katex/.bower.json",
  /**/"/assets/bower_components/katex/LICENSE",
  /**/"/assets/bower_components/katex/bower.json",
  /**/"/assets/bower_components/katex/dist/contrib/auto-render.js",
  /**/"/assets/bower_components/katex/dist/contrib/auto-render.min.js",
  /**/"/assets/bower_components/katex/dist/contrib/auto-render.mjs",
  /**/"/assets/bower_components/katex/dist/contrib/copy-tex.css",
  /**/"/assets/bower_components/katex/dist/contrib/copy-tex.js",
  /**/"/assets/bower_components/katex/dist/contrib/copy-tex.min.css",
  /**/"/assets/bower_components/katex/dist/contrib/copy-tex.min.js",
  /**/"/assets/bower_components/katex/dist/contrib/copy-tex.mjs",
  /**/"/assets/bower_components/katex/dist/contrib/mathtex-script-type.js",
  /**/"/assets/bower_components/katex/dist/contrib/mathtex-script-type.min.js",
  /**/"/assets/bower_components/katex/dist/contrib/mathtex-script-type.mjs",
  /**/"/assets/bower_components/katex/dist/contrib/mhchem.js",
  /**/"/assets/bower_components/katex/dist/contrib/mhchem.min.js",
  /**/"/assets/bower_components/katex/dist/contrib/mhchem.mjs",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_AMS-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_AMS-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_AMS-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Caligraphic-Bold.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Caligraphic-Bold.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Caligraphic-Bold.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Caligraphic-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Caligraphic-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Caligraphic-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Fraktur-Bold.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Fraktur-Bold.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Fraktur-Bold.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Fraktur-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Fraktur-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Fraktur-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-Bold.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-Bold.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-Bold.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-BoldItalic.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-BoldItalic.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-BoldItalic.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-Italic.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-Italic.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-Italic.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Main-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Math-BoldItalic.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Math-BoldItalic.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Math-BoldItalic.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Math-Italic.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Math-Italic.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Math-Italic.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_SansSerif-Bold.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_SansSerif-Bold.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_SansSerif-Bold.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_SansSerif-Italic.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_SansSerif-Italic.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_SansSerif-Italic.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_SansSerif-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_SansSerif-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_SansSerif-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Script-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Script-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Script-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size1-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size1-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size1-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size2-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size2-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size2-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size3-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size3-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size3-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size4-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size4-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Size4-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Typewriter-Regular.ttf",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Typewriter-Regular.woff",
  /**/"/assets/bower_components/katex/dist/fonts/KaTeX_Typewriter-Regular.woff2",
  /**/"/assets/bower_components/katex/dist/katex.css",
  /**/"/assets/bower_components/katex/dist/katex.js",
  /**/"/assets/bower_components/katex/dist/katex.min.css",
  /**/"/assets/bower_components/katex/dist/katex.min.js",
  /**/"/assets/bower_components/katex/dist/katex.mjs",
  /**/"/assets/bower_components/katex/yarn.lock",
  /**/"/assets/icomoon/.DS_Store",
  /**/"/assets/icomoon/fonts/icomoon.eot",
  /**/"/assets/icomoon/fonts/icomoon.svg",
  /**/"/assets/icomoon/fonts/icomoon.ttf",
  /**/"/assets/icomoon/fonts/icomoon.woff",
  /**/"/assets/icomoon/selection.json",
  /**/"/assets/icomoon/style.css",
  /**/"/assets/icomoon-pretentious.zip",
  /**/"/assets/img/.DS_Store",
  /**/"/assets/img/blog/.DS_Store",
  /**/"/assets/img/blog/COLOURlovers.com-Hydejack.png",
  /**/"/assets/img/blog/blog-layout.jpg",
  /**/"/assets/img/blog/caleb-george-old.jpg",
  /**/"/assets/img/blog/caleb-george.jpg",
  /**/"/assets/img/blog/cover-page.jpg",
  /**/"/assets/img/blog/dark-mode-ii.jpg",
  /**/"/assets/img/blog/dark-mode.jpg",
  /**/"/assets/img/blog/example-content-ii.jpg",
  /**/"/assets/img/blog/example-content-iii.jpg",
  /**/"/assets/img/blog/grid.jpg",
  /**/"/assets/img/blog/hydejack-8.png",
  /**/"/assets/img/blog/hydejack-8@0,25x.png",
  /**/"/assets/img/blog/hydejack-8@0,5x.png",
  /**/"/assets/img/blog/lazy-images.jpg",
  /**/"/assets/img/blog/louis-hansel.jpg",
  /**/"/assets/img/blog/resume.png",
  /**/"/assets/img/blog/steve-harvey.jpg",
  /**/"/assets/img/blog/w3m.png",
  /**/"/assets/img/blog/wade-lambert.jpg",
  /**/"/assets/img/docs/google-fonts.png",
  /**/"/assets/img/projects/.DS_Store",
  /**/"/assets/img/projects/hy-drawer.svg",
  /**/"/assets/img/projects/hy-img.svg",
  /**/"/assets/img/projects/hy-push-state.svg",
  /**/"/assets/img/sidebar-bg.jpg",
  /**/"/assets/img/swipe.svg",
  /**/"/assets/js/.DS_Store",
  /**/"/assets/js/LEGACY-drawer-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-fetch-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-intersection-observer-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-navbar-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-push-state-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-resize-observer-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-search-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-shadydom-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-toc-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-vendors~drawer~push-state-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-vendors~drawer~push-state~search-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-vendors~push-state-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-vendors~shadydom-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-vendors~toc-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-vendors~webanimations-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-vendors~webcomponents-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/LEGACY-webcomponents-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/drawer-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/fetch-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/intersection-observer-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/kv-storage-polyfill/.DS_Store",
  /**/"/assets/js/kv-storage-polyfill/dist/kv-storage-polyfill.umd.js",
  /**/"/assets/js/kv-storage-polyfill/dist/kv-storage-polyfill.umd.js.map",
  /**/"/assets/js/kv-storage-polyfill/package.json",
  /**/"/assets/js/minisearch/.DS_Store",
  /**/"/assets/js/minisearch/dist/.DS_Store",
  /**/"/assets/js/minisearch/dist/umd/index.js",
  /**/"/assets/js/minisearch/dist/umd/index.min.js",
  /**/"/assets/js/minisearch/dist/umd/index.min.js.map",
  /**/"/assets/js/minisearch/package.json",
  /**/"/assets/js/navbar-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/push-state-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/resize-observer-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/search-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/shadydom-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/toc-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/vendors~drawer~push-state-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/vendors~drawer~push-state~search-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/vendors~push-state-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/vendors~shadydom-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/vendors~toc-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/vendors~webanimations-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/js/webcomponents-hydejack-9.0.0-alpha.13.js",
  /**/"/assets/version.json",
  /**/
];

const PRE_CACHED_ASSETS = [
  '/assets/icons/favicon.ico',
  /**/
  /**/"/assets/img/me@2x.jpg",/**/
  /**/"/cdn-cgi/scripts/f2bf09f8/cloudflare-static/email-decode.min.js",
  /**/
];

// Files we add on every service worker installation.
const CONTENT_FILES = [
  "/",
  "/?source=pwa",
  "/assets/manifest.json",
  "/offline.html",
  /**/
];

const SITE_URL = new URL("/", self.location);
const OFFLINE_PAGE_URL = new URL("/offline.html", self.location);

self.addEventListener("install", e => e.waitUntil(onInstall(e)));
self.addEventListener("activate", e => e.waitUntil(onActivate(e)));
self.addEventListener("fetch", e => e.respondWith(onFetch(e)));

// Takes a URL with pathname like `/foo/bar/file.txt` and returns just the dirname like `/foo/bar/`.
const dirname = ({ pathname }) => pathname.replace(/[^/]*$/, "");

function matchAll(text, regExp) {
  const globalRegExp = new RegExp(regExp, 'g'); // force global regexp to prevent infinite loop
  const matches = [];
  let lastMatch;
  while (lastMatch = globalRegExp.exec(text)) matches.push(lastMatch);
  return matches;
}

// Returns the second element of an iterable (first match in RegExp match array)
const second = ([, _]) => _;

const toAbsoluteURL = url => new URL(url, self.location);

// Creates a URL that bypasses the browser's HTTP cache by appending a random search parameter.
function noCache(url) {
  return new Request(url, { cache: 'no-store' });
}

// Removes the sw search paramter, if present.
function noSWParam(url) {
  const url2 = new URL(url);
  if (url2.searchParams.has(CACHE_SEARCH_PARAM)) {
    url2.searchParams.delete(CACHE_SEARCH_PARAM);
    return url2.href;
  }
  return url;
}

const warn = (e) => {
  console.warn(e);
  return new Response(e.message, { status: 500 });
}

async function getIconFontFiles() {
  const fontURLs = STATIC_FILES.filter(x => (
    x.startsWith('/assets/icomoon/fonts/') &&
    x.endsWith('.woff') 
  ));
  return [ICON_FONT, ...fontURLs];
}
 
async function getKaTeXFontFiles() {
  const fontURLs = STATIC_FILES.filter(x => (
    x.startsWith('/assets/bower_components/katex/dist/fonts/') &&
    x.endsWith('.woff2')
  ));
  return [KATEX_FONT, ...fontURLs];
}

async function getGoogleFontsFiles() {
  const googleFontRes = await fetch(noCache(GOOGLE_FONTS)).catch(warn);
  if (googleFontRes.ok) {
    const text = await googleFontRes.text();
    return [GOOGLE_FONTS, ...matchAll(text, RE_CSS_URL).map(second)];
  }
  return [];
}

function addAll(cache, urls) {
  return Promise.all(
    urls.map(url => (
      fetch(noCache(toAbsoluteURL(url)))
        .then(res => cache.put(url, res))
        .catch(warn)
      )
    )
  );
}

async function cacheShell(cache) {
  const fontFiles = await Promise.all([
    getIconFontFiles(),
    /**/
    /**/getKaTeXFontFiles(),/**/
  ]);

  const jsFiles = STATIC_FILES.filter(url => (
    url.startsWith('/assets/js/') &&
    url.endsWith('.js') && !url.includes('LEGACY')
  ));

  const urls = SHELL_FILES.concat(jsFiles, ...fontFiles).filter(x => !!x);
  return addAll(cache, urls);
}

async function cacheAssets(cache) {
  const urls = PRE_CACHED_ASSETS.filter(x => !!x);
  return addAll(cache, urls);
}

async function cacheContent(cache) {
  const urls = CONTENT_FILES.filter(x => !!x);
  return addAll(cache, urls);
}

async function preCache() {
  const keys = await caches.keys();

  if (keys.includes(SHELL_CACHE) && keys.includes(ASSETS_CACHE)) {
    const contentCache = await caches.open(CONTENT_CACHE);
    return cacheContent(contentCache);
  } else {
    const [shellCache, assetsCache, contentCache] = await Promise.all([
      caches.open(SHELL_CACHE),
      caches.open(ASSETS_CACHE),
      caches.open(CONTENT_CACHE),
    ]);
    return Promise.all([
      cacheShell(shellCache),
      cacheAssets(assetsCache),
      cacheContent(contentCache),
    ]);
  }
}

async function onInstall() {
  await preCache();
  return self.skipWaiting();
}

const isSameSite = ({ origin, pathname }) => origin === SITE_URL.origin && pathname.startsWith(SITE_URL.pathname);
const isAsset = ({ pathname }) => pathname.startsWith("/assets");
const hasSWParam = ({ searchParams }) => searchParams.has(CACHE_SEARCH_PARAM);
const isGoogleFonts = ({ hostname }) => hostname === 'fonts.googleapis.com' || hostname === 'fonts.gstatic.com'

async function cacheResponse(cacheName, req, res) {
  const cache = await caches.open(cacheName);
  return cache.put(req, res);
}

async function fetchAndCache(cacheName, url, request, e) {
  const response = await fetch(noCache(noSWParam(url)));
  if (response.ok) e.waitUntil(cacheResponse(cacheName, request, response.clone()));
  return response;
}

async function onActivate() {
  await self.clients.claim();

  const keys = await caches.keys();

  return Promise.all(
    keys
      // Only consider caches created by this baseurl, i.e. allow multiple Hydejack installations on same domain.
      .filter(key => key.endsWith("sw/"))
      // Delete old caches
      .filter(key => key !== SHELL_CACHE && key !== ASSETS_CACHE && key !== CONTENT_CACHE)
      .map(key => caches.delete(key))
  );
}

const NEVER = new Promise(() => {});

// Returns the first promise that resolves with non-nullish value,
// or `undefined` if all promises resolve with a nullish value.
// Note that this inherits the behavior of `Promise.race`,
// where the returned promise rejects as soon as one input promise rejects.
async function raceTruthy(iterable) {
  const ps = [...iterable].map(_ => Promise.resolve(_));
  let { length } = ps;
  const continueWhenNullish = value => value != null
    ? value
    : --length > 0
      ? NEVER
      : undefined;
  return Promise.race(ps.map(p => p.then(continueWhenNullish)));
}

async function fromNetwork(url, ...args) {
  const cacheName = isAsset(url) || hasSWParam(url) ? ASSETS_CACHE : CONTENT_CACHE;
  return fetchAndCache(cacheName, url, ...args);
}

async function onFetch(e) {
  const { request } = e;
  const url = new URL(request.url);

  // Bypass
  // ------
  // Go to network for non-GET request and Google Analytics right away.
  const shouldCache = isSameSite(url) || hasSWParam(url) || isGoogleFonts(url);
  if (request.method !== "GET" || !shouldCache) {
    return fetch(request).catch(e => Promise.reject(e));
  }

  try {
    // Caches
    // ------
    const matching = await raceTruthy([
      caches.open(SHELL_CACHE).then(c => c.match(url.href, { ignoreSearch: true })),
      caches.open(ASSETS_CACHE).then(c => c.match(url.href, { ignoreSearch: true })),
      caches.open(CONTENT_CACHE).then(c => c.match(url.href, { ignoreSearch: true })),
    ]);

    if (matching) return matching;

    // Network
    // -------
    // Got to network otherwise. Show 404 when there's a network error.
    // TODO: Use separate offline site instead of 404!?
    return await fromNetwork(url, request, e);
  } catch (err) {
    // console.error(err)
    const cache = await caches.open(CONTENT_CACHE);
    return cache.match(OFFLINE_PAGE_URL);
  }
}

// 

