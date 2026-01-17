import { Link } from 'react-router-dom';
const Sidebar = () => {
  return (
    <aside style={styles.sidebar}>
      <ul style={styles.list}>
        <li style={styles.link}><Link to="/clientes" style={styles.linkText}>Clientes</Link></li>
        <li style={styles.link}><Link to="/cuentas" style={styles.linkText}>Cuentas</Link></li>
        <li style={styles.link}><Link to="/movimientos" style={styles.linkText}>Movimientos</Link>
        </li>
        <li style={styles.link}><Link to="/reportes" style={styles.linkText}>Reportes</Link></li>



        
      </ul>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '220px',

    padding: '20px',
    height: '100vh' // ocupa toda la altura de la pantalla
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  link: {
    padding: '10px 0',
    cursor: 'pointer',
    color: '#333',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',

  },
  linkText: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
};

export default Sidebar;
