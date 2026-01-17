const Header = () => {
  return (
    <header style={styles.header}>
      <h2 style={styles.h2}>Banco</h2>
    </header>
  );
};

const styles = {
  header: {
    height: '60px',
    width: '100%',
    
    color: 'black',
    display: 'flex',
    
    
    alignItems: 'center',
    paddingLeft: '20px',
    justifyContent: 'center' ,
    borderBottom: '2px solid #ddd'

  },
  h2:{
    color:'blue'
    

  }
};

export default Header;
