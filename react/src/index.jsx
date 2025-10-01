// C:\BILAL Important\Project_Dashboard\react\src\index.jsx
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from './contexts/ConfigContext';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ConfigProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ConfigProvider>
);

reportWebVitals();
