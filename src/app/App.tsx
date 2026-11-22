import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { isMatchPage, pageForHash } from './navigation';
import type { Page } from './navigation';
import { useNavPreferences } from './preferences';
import { Home } from '../pages/Home';
import { Play } from '../pages/Play';
import { Computer } from '../pages/Computer';
import { Training } from '../pages/Training';
import { Puzzles } from '../pages/Puzzles';
import { Analysis } from '../pages/Analysis';
import { Tournaments } from '../pages/Tournaments';
import { Learning } from '../pages/Learning';
import { Friends } from '../pages/Friends';
import { History } from '../pages/History';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';

function renderPage(page: Page) {
  switch (page.id) {
    case 'inicio': return <Home />;
    case 'jogar': return <Play />;
    case 'computador': return <Computer />;
    case 'treinamento': return <Training />;
    case 'quebra-cabecas': return <Puzzles />;
    case 'analise': return <Analysis />;
    case 'torneios': return <Tournaments />;
    case 'aprendizado': return <Learning />;
    case 'amigos': return <Friends />;
    case 'historico': return <History />;
    case 'perfil': return <Profile />;
    case 'configuracoes': return <Settings />;
    default: return <Home />;
  }
}

export function App() {
  const [page, setPage] = useState(() => pageForHash(window.location.hash));
  const { compactMatches } = useNavPreferences();

  useEffect(() => {
    const update = () => {
      setPage(pageForHash(window.location.hash));
      window.scrollTo?.(0, 0);
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const compact = compactMatches && isMatchPage(page.id);

  return (
    <div className="app-shell">
      <Header page={page} compact={compact} />
      <main className="content" key={page.id}>
        {renderPage(page)}
      </main>
      <footer className="footer">
        <span>© CHESS CORE <span aria-hidden="true">·</span> THE HEART OF CHESS.</span>
        <span>PROJETADO PARA O SEU PRÓXIMO MOVIMENTO <span aria-hidden="true">✳</span></span>
      </footer>
    </div>
  );
}
