import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from '@/hooks/useTheme';
import { SessionProvider } from '@/store/session';
import { CatalogProvider } from '@/store/catalog';
import { FeedbackProvider } from '@/components/feedback/FeedbackProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SessionProvider>
        <CatalogProvider>
          <FeedbackProvider>
            <App />
          </FeedbackProvider>
        </CatalogProvider>
      </SessionProvider>
    </ThemeProvider>
  </StrictMode>
);
