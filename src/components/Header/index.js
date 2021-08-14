import './header.css'
import avatar from '../../assets/avatar.png'
import {useContext} from 'react'
import { AuthContext } from '../../contexts/auth'
import { Link } from 'react-router-dom'
import {FiHome, FiUser, FiSettings, FiPlusCircle} from 'react-icons/fi'

export default function Header() {
const {user} = useContext(AuthContext) // user contem informações de usuario em um objeto


 return (
   <div className='sideBar'>
         <div>
             <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt='Foto avatar'/>
         </div>
         <Link to='/dashboard'>
             <FiHome color='#FFF' size={24}/>
         Chamados
         </Link>
         <Link to='/novo'>
             <FiPlusCircle color='#FFF' size={24}/>
         Novo chamado
         </Link>
         
         
         <Link to='/clientes'>
             <FiUser color='#FFF' size={24}/>
         Cadastrar clientes
         </Link>
         <Link to='/profile'>
             <FiSettings color='#FFF' size={24}/>
         Configurações
         </Link>
   </div>
 );
}