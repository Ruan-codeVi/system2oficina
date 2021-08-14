import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth' 
import {Link} from 'react-router-dom'
import './signin.css'
import logo from '../../assets/car1.png'
import backgroudVideo from '../../assets/backgroudVideo.mp4'
import { toast } from 'react-toastify';


export default function SignIn() {
  // Context
const {logar, loadingAuth} = useContext(AuthContext)

  // Estados
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  function handleSubmit( e ) {
    e.preventDefault()
    
    if ( email !== '' && password !== '' ) {
        logar(email, password)
    } else if (email ==='' || password==='') {
      toast.error("Preencha os campos")
    }
  }
 
  return (
    <div className='container-center'>
      <video autoPlay loop
        style={{
          position: 'absolute',
          width: '100%',
          // left: '50%',
          // top: '50%',
          height: '100%',
          objectFit: 'cover',
          // transform: 'translate(-50%, -50%)',
          zIndex: '-1'
      }}
      >
        <source src={ backgroudVideo} type='video/mp4'/>
      </video>
      <div className='login'>
        <div className='logo-area'>
          <img src={logo} alt='logo'/>
         </div>
        
        <form onSubmit={handleSubmit} >
          {/* <h1>Bem vindo</h1> */}
          <input type='text' placeholder='Email@email.com'
            value={email} onChange={(e)=> setEmail(e.target.value) }/>
          <input type='password' placeholder='Senha'
            value={password} onChange={(e)=> setPassword(e.target.value)} />
          <button type='submit'>{loadingAuth ? 'Carregando...' : 'Entrar'}</button>
        </form>
        <Link to='/cadastro'> Criar nova conta</Link>
        </div>
        
    </div>
    
 );
}