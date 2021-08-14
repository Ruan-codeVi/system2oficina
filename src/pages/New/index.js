
import Title from '../../components/Title'
import Header from '../../components/Header'
import { FiPlus } from 'react-icons/fi'
import './new.css'
import {toast} from 'react-toastify'

import {useState, useEffect, useContext} from 'react'  
import { AuthContext } from '../../contexts/auth'
import firebase from '../../services/firebaseConnection'


export default function Novo() {
                           // Contexto
  const {user} = useContext(AuthContext)

  const [clientes, setClientes] = useState( [] )
  const [loading_Cli, setLoading_Cli] = useState( true )
  const [clienteSelect, setClienteSelect] = useState(0)
  const [auto, setAuto] = useState( '' )
  const [placa, setPlaca] = useState( '' )
  const [servico, setServico] = useState( 'Avaliacao' )
  const [status, setStatus] = useState( 'Aberto' )
  const [complemento, setComplemento] = useState('')

// Chama quando abre a aplicação
  useEffect( () => {
    
// Vai trazer clientes la do firebase quando aplicação abrir 
    async function carregaClientes_Firebase() {
      await firebase.firestore().collection( 'clientes' )
        .get() //pegar
        .then( (snapshot) => { // caso de sucesso, recebe snpashot de cliente
          let lista = []
          snapshot.forEach( ( doc ) => { //dentro de cliente, para cada documento da um push em obj
            lista.push( {
              id: doc.id,
              nome: doc.data().nome

            })
          } )

          // Verificando se lista não esta vazia
          if ( lista.length === 0 ) {
            console.log( 'Nenhum cliente encontrado' );
            setClientes( [{ id: '1', cliente: ''}])
            setLoading_Cli( false )
            return;
          }
          setClientes( lista )
          setLoading_Cli(false)

        } )
        .catch( ( erro ) => {
          console.log( erro );
          setLoading_Cli( false )
          setClientes( [{ id: '1', cliente: ''}])
        })
  }
  carregaClientes_Firebase()
},[])

  // Chamando quando clica em cadastrar
 async function handleRegistrarCliente_Firebase( e ) {
    e.preventDefault()
   await firebase.firestore().collection( 'chamados' )
     .add( {
       criado: new Date(),
       cliente: clientes[clienteSelect].nome,
       clienteID: clientes[clienteSelect].id,
       auto: auto,
       placa: placa,
       servico: servico,
       status: status,
       complemento: complemento,
       userID: user.uid  // usuario que ta cadastrando chamado
     } )
     .then( () => {
       toast.success( 'Chamando cadastrado com sucesso!' )
       setAuto( '' )
       setPlaca( '' )
       setServico( 'Avaliacao' )
       setStatus('Aberto')
       setClienteSelect( 0 )
       setComplemento('')
       
     } )
     .catch( ( erro ) => {
       console.log( erro );
       toast.error('Falha a tentar cadastrar!, tente mais tarde.')
       
     })
  }

  // Chamado quando troca serviço e manda pra state
  function trocaServico_Select( e ) {
    setServico( e.target.value )
    console.log(e.target.value);
  }

  // Chamado quando troca o status, e manda para o state
  function trocaStatusRadio( e ) {
    setStatus(e.target.value)
    console.log(e.target.value);
  }
// chamado quando troca cliente
  function handleTrocaCliente( e ) {
    console.log( 'index do cli selecionado', e.target.value );
    console.log( 'Cliente selecionado', clientes[e.target.value] );
    setClienteSelect(e.target.value)
}

    return (
      <div>
        <Header />
        <div className='content'>
          <Title name='Novo Chamado'>
            <FiPlus size={25}/>
          </Title>

          <div className='container'>

            <form className='form-profile' onSubmit={handleRegistrarCliente_Firebase}>
              <label className='tipo'>Pessoa Física / Empresa - cnpj</label>
              {loading_Cli ? (
                <input type='text' disabled={true} value='Carregando clientes...' />
              ) : (
                      <select value={clienteSelect} onChange={handleTrocaCliente}>
                      {clientes.map( ( item, index ) => {
                        return (
                          <option key={item.id} value={index}>
                            {item.nome}
                          </option>
                        )
                      })}
                      </select>
                )}
             
              
              <label>Automóvel</label>
                <input className='auto'
                  type='text'
                  placeholder='Marca ou Modelo'
                  value={auto}
                  onChange={(e)=> setAuto(e.target.value)}
                />
                <label>Placa</label>
                <input className='placa'
                type='text'
                placeholder='aaaa000'
                value={placa}
                onChange={(e)=> setPlaca(e.target.value)}
                />
              
              <label>Serviço</label>
              <select value={servico} onChange={trocaServico_Select}>
                <option value='Avaliacao'>Avaliação</option>
                <option value='Revisao'>Revisão</option>
                <option value='Revisao obrigatoria'>Revisão obrigatória</option>
                <option value='Troca de Bateria'>Troca de bateria</option>
                <option value='Alinhamento/Balanceamento'>Alinhamento/Balanceamento</option>
                <option value='Filtro/óleo'>Filtro/óleo</option>
                <option value='Freios'>Freios</option>
                <option value='Supensao'>Supensão</option>
                <option value='Escapamento'>Escapamento</option>
                <option value='Motor'>Motor</option>
                <option value='Cambio'>Câmbio</option>
                <option value='Eletrica'>Eletrica</option>
                <option value='Computador de bordo'>Computador de bordo</option>
                <option value='Remap'>Remap</option>
                <option value='Troca de peca'>Troca de peças</option>
              </select>

              <label>Status</label>
              <div className='status'>
                <input
                  type='radio'
                  name='radio'
                  value='Aberto'
                  onChange={trocaStatusRadio}
                  checked={status === 'Aberto'}
                />
                <span>Aberto</span>

                <input
                  type='radio'
                  name='radio'
                  value='Progresso'
                  onChange={trocaStatusRadio}
                  checked={status === 'Progresso'}
                />
                <span>Progresso</span>
                <input
                  type='radio'
                  name='radio'
                  value='Finalizado'
                  onChange={trocaStatusRadio}
                  checked={status === 'Finalizado'}
                />
                <span>Finalizado</span>
              </div>
              <label>Complemento</label>
              <textarea
                type='text'
                placeholder='Observações (Opcional).'
                value={complemento}
                onChange={(e)=> setComplemento(e.target.value)}
              />
              
              <button className='cadastrar' type='submit'>Cadastrar</button>
            </form>
          </div>
        </div>
      </div>
    )
  }