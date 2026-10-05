import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import {LanguageProvider} from '../src/i18n';
import {SiteContent} from '../src/Site';
import type {Language} from '../src/i18n/translations';
import {localePath} from '../src/lib/locale-path';
export function renderPage(path:string,language:Language) {
 return renderToString(<LanguageProvider defaultLanguage={language}><StaticRouter basename={language==='en'?'/':`/${language}`} location={localePath(path,language)}><SiteContent/></StaticRouter></LanguageProvider>,{identifierPrefix:'luminore-'});
}
