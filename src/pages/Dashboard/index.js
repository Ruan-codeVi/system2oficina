import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import {Link} from 'react-router-dom'
import Header from '../../components/Header'
import Title from '../../components/Title'
import Modal from '../../components/Modal'
import './dashboard.css'
import {format} from 'date-fns'
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'

import firebase from '../../services/firebaseConnection'

// Var de referencia para evitar repetição de codigo
const listRef = firebase.firestore().collection( 'chamados' ).orderBy( 'criado', 'desc' )
.limit(5)


export default function Dashboard() {
  const { deslogarFirebase} = useContext( AuthContext )
  const [chamados, setChamados] = useState( [] )
  const [loading, setLoading] = useState( true )
  const [carregarMais, setCarregarMais] = useState( false )
  const [estaVazia, setEstaVazia] = useState( false )
  const [ultimoDoc_State, setUltimoDoc_State] = useState()
  const [mostrarPostModal, setMostrarPostModal] = useState( false )
  const [detalhes, setDetalhes] = useState()
  
  useEffect( () => {

    async function buscarChamadosFirebase() {
      await listRef.limit( 5 )
        .get()
        .then( (snapshot) => {
          acessaAndMonta(snapshot)
        } )
        .catch( ( erro ) => {
          console.log( erro );
          setCarregarMais(false)
        } )
      setLoading(false)
    }
   
    buscarChamadosFirebase()

    return () => {
      // Para quando o component for desmontado
    }
  }, [] )
  


  // Acessado a promisse com a response e montando a lista com chamados
  async function acessaAndMonta( snapshot ) {
    const colecaoEstaVazia = snapshot.size === 0

    if ( !colecaoEstaVazia ) {
      let lista = []

      snapshot.forEach(doc => {
        lista.push( {
          id: doc.id,
          auto: doc.data().auto,
          cliente: doc.data().cliente,
          clienteID: doc.data().clienteID,
          placa: doc.data().placa,
          servico: doc.data().servico,
          complemento: doc.data().complemento,
          criado: doc.data().criado,
          //Formatação da propriedade criado
          criadoFormt: format( doc.data().criado.toDate(), 'dd/MM/yyyy' ),
          status: doc.data().status
        })
      } );

      // Para guardar ultimo doc buscado, para evitar duplicação
      const ultimoDoc_Var = snapshot.docs[snapshot.docs.length - 1]
      setChamados( chamados => [...chamados, ...lista] )
      setUltimoDoc_State(ultimoDoc_Var)
    
    } else {
      setEstaVazia(true)
    }

    setCarregarMais(false)
  }

  // Chama quando clica no 'botao buscar mais', busca no firebase
 async function handleCarregarMais_Firebase() {
   setCarregarMais( true )
   await listRef.startAfter( ultimoDoc_State ).limit( 5 ) // começa depois do ultimo Doc
     .get()
     .then( (snapshot) => {
      acessaAndMonta(snapshot)
     } )
     .catch( ( erro ) => {
     console.log(erro);
   })
   
}
// Chama quando clica nos icones
  function togglePostModal( item ) {
    //Sempre envia a negação do valor atual para a state
    setMostrarPostModal( !mostrarPostModal )
    setDetalhes(item)
  }

  if ( loading ) {
    return(
    <div>
      <Header/>
     <div className='content'>
       <Title name='Atendimentos'>
         <FiMessageSquare size={25}/>
        </Title>

        <div className='container dashboard'>
            <span>Buscando Chamados...</span>
        </div>

        </div>
      </div>
      )
}

 return (
   <div>
     <Header/>
     <div className='content'>
       <Title name='Chamados'>
         <FiMessageSquare size={25}/>
       </Title>
       
       {/* Renderiza quando não tem chamados */}
       {chamados.length === 0 ? (
         <div className='container dashboard'>
         <span>Nenhum chamado registrado</span>
         
         <Link to='/novo' className='novo'>
              <FiPlus size={25} color='#FFF'/>
                      Novo chamado
         </Link>
       </div>
       ) : (
           <>
           <Link to='/novo' className='novo'>
             <FiPlus size={25} color='#FFF'/>
                   Novo chamado
             </Link>
             
             <table>
               {/* Tag cabeçalho */}
               <thead>
                 <tr> 
                   <th scope='col'>Cliente</th>
                   <th scope='col'>Automóvel</th>
                   <th scope='col'>Placa</th>
                   <th scope='col'>Serviço</th>
                   <th scope='col'>Status</th>
                   <th scope='col'>Cadastrado em</th>
                   <th scope='col'>#</th>
                 </tr>
               </thead>
               <tbody>
               {chamados.map( (item, index) => {
                    return (
                        <tr key={index}>
                        <td data-label='Cliente'> {item.cliente } </td>
                        <td data-label='Automovel'> {item.auto} </td>
                        <td data-label='Placa'> {item.placa} </td>
                        <td data-label='Servico'> {item.servico} </td>
                        <td data-label='Status'>
                          <span className='badge'
                            style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c'
                              : item.status === 'Progresso' ? '#F6a935' : '#eb0a0a'}}>
                            {item.status} </span>
                        </td>
                        <td data-label='Cadastrado'> {item.criadoFormt} </td>
                        <td data-label='#'>
                          <button className='action' style={{backgroundColor:'#3583'} } onClick={()=> togglePostModal(item)}>
                            <FiSearch color='#FFF' size={17}/>
                          </button>                                                  
                          <Link className='action' style={{backgroundColor:'#F6a935'} } to={`/editar/${item.id}`}> {/* navega ate rota novo passando id do item clicado*/}
                            <FiEdit2 color='#FFF' size={17}/>
                          </Link>
                        </td>
                      </tr>
                    )
                 })}
                
                </tbody>

             </table>
             {carregarMais &&
               <h3 style={{ textAlign: 'center', marginTop: 15, color:'#FFF' }}>Buscando dados...</h3>}
             {!carregarMais && !estaVazia
               && <button className='btn-mais'
                 onClick={handleCarregarMais_Firebase}>Buscar mais</button>}
         </>
       )}

            <button className='logout-deslogar' onClick={()=> deslogarFirebase()}>
              Sair
            </button>
     </div>
     {/* Se for true, renderiza */}
     {mostrarPostModal && (
       <Modal conteudo={detalhes} close={togglePostModal} />
       
     )}


            
       
   </div>
 );
}