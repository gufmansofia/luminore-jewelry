import {Link} from 'react-router-dom';
import {HeaderLogo} from './HeaderLogo';
import {LanguageSelect} from './LanguageSelect';
import {SavedPiecesButton} from './SavedPieces';
export function DetailHeader({back,onBack,mobileBack,backFirst=true,theme='dark'}:{back:string;onBack:()=>void;mobileBack?:string;backFirst?:boolean;theme?:'dark'|'light'}){
 const backButton = <button type="button" onClick={onBack} className={`detail-back${backFirst?' detail-back--compact':''} text-sm text-silver hover:underline underline-offset-4`} aria-label={back}>{backFirst&&<span className="detail-back-arrow" aria-hidden="true">←</span>}{mobileBack?<><span className="detail-back-full">{back}</span><span className="detail-back-short" aria-hidden="true">{mobileBack}</span></>:back}</button>;
 return <header data-theme={theme} className={`detail-header ${theme==='light'?'detail-header--light':''} fixed top-0 left-0 right-0 z-50 bg-ink/95 backdrop-blur-md border-b border-silver/15`}>
 <div className="detail-header-inner max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between gap-3 h-20">
 <Link to="/" className="wordmark" aria-label="Luminore"><HeaderLogo light={theme === 'dark'} /></Link>
 <div className="detail-header-actions flex items-center gap-3 sm:gap-6">{backFirst&&backButton}<SavedPiecesButton/>{!backFirst&&backButton}<LanguageSelect/></div>
 </div></header>;
}
