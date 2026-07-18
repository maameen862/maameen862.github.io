import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { LightboxProvider } from './components/Lightbox';

function App() {
  return (
    <LightboxProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </LightboxProvider>
  );
}

export default App;
