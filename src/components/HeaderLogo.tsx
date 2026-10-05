/** The supplied wordmark, framed to its artwork without the empty export canvas. */
export function HeaderLogo({ light = false }: { light?: boolean }) {
  return <img className={`header-logo${light ? ' header-logo--light' : ''}`} src="/luminore-logo.svg" width={551} height={73} alt="Luminore" draggable={false} />;
}
