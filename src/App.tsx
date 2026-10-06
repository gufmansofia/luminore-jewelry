import './index.css';
import './styles/editorial.css';
import './styles/interactions.css';
import './styles/site-refinements.css';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import { initialLanguage } from './lib/locale-path';
import { SiteContent, LangSync } from './Site';
import './styles/mobile-audit-improvements.css';
import './styles/typography-refinements.css';
export function App() {
  const language = initialLanguage();
  return <LanguageProvider defaultLanguage={language}><LangSync /><BrowserRouter basename={language==='en'?'/':`/${language}`}><SiteContent /></BrowserRouter></LanguageProvider>;
}
export default App;
