import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter,Routes,Route} from 'react-router-dom';
import {LanguageProvider} from '../src/i18n';
import {ProductDetail} from '../src/components/ProductDetail';
import {BlogPost} from '../src/components/BlogPost';
import {products} from '../src/data/products';
import {blogPosts} from '../src/data/blogs';
import {SavedPiecesProvider} from '../src/components/SavedPieces';
let pages=0;
for(const language of ['en','ru','uk'] as const)for(const route of [...products.map(p=>`/product/${p.id}`),...blogPosts.map(p=>`/blog/${p.slug}`)]){
 const html=renderToStaticMarkup(<LanguageProvider defaultLanguage={language}><MemoryRouter initialEntries={[route]}><SavedPiecesProvider><Routes><Route path="/product/:id" element={<ProductDetail/>}/><Route path="/blog/:slug" element={<BlogPost/>}/></Routes></SavedPiecesProvider></MemoryRouter></LanguageProvider>);
 if(!html.includes('src="/luminore-logo.svg"')||!html.includes('alt="Luminore"')||!html.includes('language-select'))throw new Error(`Header missing ${language} ${route}`);
 if(/logo-full\.png|772671095|781611480/.test(html))throw new Error(`Old branding or report numbers ${route}`);
 pages++;
}
console.log(`Rendered ${pages} product/article language combinations successfully.`);
