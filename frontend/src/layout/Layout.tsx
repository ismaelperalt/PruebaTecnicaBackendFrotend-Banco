import Header from './Header';
import Sidebar from './Sidebar';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: MainLayoutProps) => {
  return (
    <div style={styles.layout}>
      {/* HEADER ARRIBA */}
      <Header />

      {/* CONTENEDOR DEBAJO DEL HEADER */}
      <div style={styles.body}>
        <Sidebar />

        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const, // ✅ FIX TS
  },
  body: {
    flex: 1,
    display: 'flex' as const, // (opcional, pero correcto)
  },
  content: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
};

export default Layout;
