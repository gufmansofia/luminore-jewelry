import { useLanguage } from '../i18n';
import { choose } from '../lib/product-copy';
import { GuidedEnquiry } from './GuidedEnquiry';
import { Reveal } from './Reveal';
import { BespokeFilm } from './BespokeFilm';
export function CTA({standalone=false}:{standalone?:boolean}) {
  const { t, language } = useLanguage();
  const Heading = standalone ? 'h1' : 'h2';
  const steps = [[t.cta.step1Title,t.cta.step1Desc],[t.cta.step2Title,t.cta.step2Desc],[t.cta.step3Title,t.cta.step3Desc],[t.cta.step4Title,t.cta.step4Desc]];
  return <section id="custom-order" data-theme="light" className="editorial-section bespoke-section" aria-labelledby="bespoke-title">
    <div className="bespoke-film-copy bespoke-film-intro">
      <header className="section-heading">{standalone && <p className="section-eyebrow">{t.cta.eyebrow}</p>}<Heading id="bespoke-title">{t.cta.headline1} {t.cta.headline2}</Heading><p>{t.cta.description}</p></header>
    </div>
    <BespokeFilm />
    <div className="bespoke-film-copy"><p className="bespoke-film-caption">{choose(language,'A closer look at the craft behind your piece.','Ближе к мастерству, с которым создаётся ваше украшение.','Ближче до майстерності, з якою створюється ваша прикраса.')}</p></div>
    <div className="editorial-container bespoke-layout">
    <Reveal className="bespoke-story">
      <ol className="bespoke-steps">{steps.map(([title,desc],i)=><li key={title}><span aria-hidden="true">0{i+1}</span><div><h3>{title}</h3><p>{desc}</p></div></li>)}</ol>
    </Reveal>
    <GuidedEnquiry />
  </div></section>;
}
