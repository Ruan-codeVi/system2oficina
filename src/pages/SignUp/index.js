import { useState, useContext } from 'react';
import {Link} from 'react-router-dom'
import logo from '../../assets/car1.png'
import './signup.css'
import { AuthContext } from '../../contexts/auth'
import backgroudVideo from '../../assets/backgroudVideo.mp4'


export default function SignUp() {
  // Context
  const {casdastrarFireBase, loadingAuth} = useContext( AuthContext )
  
  // Estados
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
 
  function handleSubmit( e ) {
    e.preventDefault() // serve para empedir reload na pagina


    if ( nome !== '' && password !== '' && email !== '' ) {
      casdastrarFireBase(email, password, nome )
    }
  }
 
  return (
    <div className='container-center'>
      <video autoPlay loop
        style={{
          position: 'absolute',
          width: '100%',
          left: '50%',
          top: '50%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: '-1'
      }}
      >
        <source src={ backgroudVideo} type='video/mp4'/>
      </video>
      <div className='login'>
        <div className='logo-area'>
          <img src={logo} alt='logo'/>
        </div>
        
        <form onSubmit={handleSubmit}>
          <h1>Nova conta </h1>
          <input type='text' placeholder='Nome'
            value={nome} onChange={(e)=> setNome(e.target.value) }/>
          <input type='text' placeholder='email@email.com'
            value={email} onChange={(e)=> setEmail(e.target.value) }/>
          <input type='password' placeholder='senha'
            value={password} onChange={(e)=> setPassword(e.target.value)} />
          <button type='submit'>{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
        </form>
        <Link to='/'>Possui uma conta? Entre.</Link>
       </div>
   </div>
 );
}