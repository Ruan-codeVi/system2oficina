import { useState } from 'react'
import './customers.css'
import firebase from '../../services/firebaseConnection'
import {toast} from 'react-toastify'
import {FiUser} from 'react-icons/fi'
import Title from '../../components/Title'
import Header from '../../components/Header'





export default function Customers() {
    // States PF- pessoa Fisica
    const [nome,setNome] = useState('')
    const [tel,setTel] = useState('')
    const [endereco, setEnderecoCli] = useState( '' )
    const [cnpj,setCpnj] = useState('')
    

  async  function handleCadastrarCliente( e ) {
        e.preventDefault()
        
    //Verificação dos campos do form
      if ( nome !== "" && tel !== '' && endereco !== '') {
          if ( cnpj === '' || cnpj !== '' ) {
            
            // Indo criar uma coleção no firabe
                    await firebase.firestore().collection( 'clientes' )
                    .add( {
                        nome: nome,
                        contato: tel,
                        endereco: endereco,
                        cnpj: cnpj
                    } )
          // Caso de sucesso, then, só limpa os campos
                    .then( () => {
                    setNome( '' )
                    setTel( '' )
                    setEnderecoCli( '' )
                    setCpnj( '' )
                    toast.success('Cliente cadastrado com sucesso!')  
                } )
                .catch( ( erro ) => {
                console.log( erro );
                toast.error('Ops!, tente novamente')
                })
            }
        } else {
          toast.error('Preencha corretamente os campos')
          }
          

    }



    return (
        <div>
            <Header/>

            <div className='content'>
                <Title name='Clientes'>
                    <FiUser size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile customers' onSubmit={handleCadastrarCliente}>
                        <label className='tipo'>
                            Pessoa Física / Empresa - CNPJ
                        </label><br/>
                        <label>Nome</label>
                        <input className='cliente' type='text'placeholder='Nome Cliente / Nome fantasia' value={nome} onChange={(e)=> setNome(e.target.value) }/>

                        <label>Contato</label>
                        <input className='cliente' type='text'placeholder='Telefone-Fixo / Celular / E-mail' value={tel} onChange={(e)=> setTel(e.target.value) }/>
                        
                        <label>Endereço</label>
                        <input className='cliente' type='text' placeholder=' Cliente / Empresa' value={endereco} onChange={( e ) => setEnderecoCli( e.target.value )} />
                        <label>CNPJ</label>
                        <input className='cliente' type='text' placeholder='CNPJ' value={cnpj} onChange={( e ) => setCpnj( e.target.value )} />
                        <button className='btn-cadastrar' type='submit'>Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}