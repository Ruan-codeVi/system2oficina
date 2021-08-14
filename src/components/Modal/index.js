import React from 'react'
import './modal.css'
import {FiX} from 'react-icons/fi'

export default function Modal({conteudo, close}) {
 return (
   <div className='modal'>
         <div className='container'>
             <button className='close' onClick={close}>
                 <FiX size={23} color='#FFF' />
                 Voltar
             </button>
             <div>
                 <h2>Detalhes do chamado</h2>
                
                 <div className='row'>
                     <span>
                         Cliente: <i>{conteudo.cliente}</i>
                     </span>
                 </div>

                 
                 <div className='row'>
                     <span>
                         Automovel: <i>{conteudo.auto}</i>
                     </span>

                     <span>
                         Placa: <i>{conteudo.placa}</i>
                     </span>

                 </div>
                  
                 <div className='row'>
                     <span>
                         Serviço: <i>{conteudo.servico}</i>
                     </span>

                     <span>
                         Criado em: <i>{conteudo.criadoFormt}</i>
                     </span>

                 </div>
                  
                 <div className='row'>
                     <span>
                     Status: <i style={{color: '#FFF', backgroundColor:
                               conteudo.status === 'Aberto' ? '#5cb85c'
                                : conteudo.status === 'Progresso' ? '#F6a935' : '#eb0a0a'
                             }}>{conteudo.status}</i>
                     </span>
                 </div>

                 {conteudo.complemento !== '' && (
                        <>
                            <h3>Complemento</h3>

                            <p>
                                {conteudo.complemento}
                            </p>
                        </>
                    )}
             </div>
         </div>
   </div>
 );
}