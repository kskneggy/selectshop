import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SearchPage } from './pages/SearchPage';
import { ShopDetail } from './pages/ShopDetail';
import { BrandDetail } from './pages/BrandDetail';
import { BrandsIndex } from './pages/BrandsIndex';
import { About } from './pages/About';
import { MapPage } from './pages/MapPage';
import { SavedPage } from './pages/SavedPage';
import { ComparePage } from './pages/ComparePage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SearchPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="shop/:id" element={<ShopDetail />} />
          <Route path="brand/:name" element={<BrandDetail />} />
          <Route path="brands" element={<BrandsIndex />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
