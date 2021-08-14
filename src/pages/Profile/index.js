import './profile.css'
import {toast} from 'react-toastify'
import avatarDefaul from '../../assets/avatar.png'
import {FiSettings, FiUpload} from 'react-icons/fi'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import firebase from '../../services/firebaseConnection'




export default function Profile() {
  // Context
  const { user, deslogarFirebase, setUser, saveStorageUser } = useContext( AuthContext )
  // Estados
  const [nome, setNome] = useState(user && user.nome)
  const [email, setEmail] = useState(user && user.email)
  const [avatarUrl, setAvatarUrl] = useState( user && user.avatarUrl )
  // Para quando o usuario enviar a foto, salvar em um state separada
  const [imageEnvi, setImageEnvi] = useState(null)
  
// Função para previous da imagem de avatar antes do submit
  function handlePreviousImage(e) {

    if ( e.target.files[0] ) { // Selecionou alguma imagem?
      const image = e.target.files[0]
      
      if ( image.type === 'image/jpeg' || image.type === 'image/jpg'
        || image.type === 'image/png' || image.type === 'image/gif' ) {
        
        setImageEnvi( image )
        setAvatarUrl(URL.createObjectURL(e.target.files[0])) //Criando o previous
      } else {
        alert('Envie imagem dos tipos: JPEG/JPG/PNG ou GIF')
        setImageEnvi(null)
        return null
      }
    }
  
  }



  //Upload de imagem no firabase store
 async function handleUploadImage() {
  const atualUid = user.uid
   
  await firebase.storage()
   .ref( `images/${atualUid}/${imageEnvi.name}` )
   .put( imageEnvi )
     .then( async () => {
       toast.success('Avatar enviado com sucesso!')
       console.log( 'Foto enviada com sucesso' );

      //  Pegando a Url da foto enviada para relacionar no firestone
       await firebase.storage().ref( `images/${atualUid}` )
      .child( imageEnvi.name ).getDownloadURL()
        //  Caso consiga pegar a Url da foto
         .then( async ( url ) => {
           let urlFoto = url;

           await firebase.firestore().collection( 'users' )
           .doc( user.uid )
             .update( {
               avatarUrl: urlFoto,
               nome: nome
             } )
             .then( () => { // obj pega tudo em state user e coloca mais duas props
               let data = {
                 ...user,
                 avatarUrl: urlFoto,
                 nome:nome
               }
               setUser( data )
               saveStorageUser(data)
               
           })
       })
   })
 }
  
  // chama quando alterou algo no profile e clica em salvar
  async function handleSave( e ) {
    e.preventDefault()

    // Para caso queira mudar só o nome
    if ( imageEnvi === null && nome !== '' ) {
      // Indo no firab
      await firebase.firestore().collection( 'users' )
      .doc( user.uid )
      .update( {
        nome: nome
      } )
        .then( () => {
          // Refletindo o update para o context
          let data = {
            ...user,  // pegando tudo que ja tem em user
            nome: nome // Passando o nome digitado para esse obj
          };
          setUser( data )
          saveStorageUser( data )
          toast.success('Nome alterado com sucesso!')
         } )
        .catch( ( erro ) => {
          console.log( erro )
          toast.error('Erro ao tentar troca nome, tente mais tarde')
      })
    } //Para caso queira mudar só foto
    else if(nome !=='' && imageEnvi !== null ) {
      handleUploadImage()
      
    }
}

 return (
   <div>
     <Header />
     
     <div className='content'>
       <Title name='Meu perfil'>
         <FiSettings size={25}/>
       </Title>
       

       <div className='container'>
         <form className='form-profile' onSubmit={handleSave}>
           <label className='label-avatar'>
             <span><FiUpload color='#FFF' size={25} /></span>
             <input type='file' accept='image/*'onChange={handlePreviousImage} /><br />
             {avatarUrl === null ?
               <img src={avatarDefaul} width='250' height='250' alt='Foto de perfil padrão' />
               : <img src={avatarUrl} width='250' height='250' alt='Foto de perfil padrão'/> 
            }
           </label>
            <label className='title'>Usuário Logado:</label>
           <label>Nome</label>
           <input className='profile' type='text' value={nome} onChange={(e)=> setNome(e.target.value) }/>
           <label>E-Mail</label>
           <input className='profile' type='text' value={email} disabled={true} onChange={()=> setEmail()} />
           <button className='btn-salvar' type='submit'>Salvar</button>
        </form>
       </div>

       <div className='container'>
            <button className='logout-btn' onClick={()=> deslogarFirebase()}>
              Sair
            </button>
       </div>
     </div>

   </div>
 );
}