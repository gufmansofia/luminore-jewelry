import { useNavigate } from 'react-router-dom';

// Router history survives reloads and returns to the actual entry and its scroll
// position. A direct visit stays on the site via the page's own fallback.
export function useBackNavigation(fallback: string, state?: unknown) {
  const navigate = useNavigate();
  return () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(fallback, { replace: true, state });
  };
}
