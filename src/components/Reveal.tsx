import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useMotion';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, phase } = useReveal<HTMLDivElement>();
  return <div ref={ref} className={`motion-reveal ${className}`} data-reveal={phase}>{children}</div>;
}
