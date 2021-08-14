import { useState, useEffect, createContext } from 'react'
import firebase from '../services/firebaseConnection'
import {toast} from 'react-toastify'

// Criando um contexto para espalha informações para outros components

export const AuthContext = createContext({})

function AuthProvider( { children } ) {
    const [user, setUser] = useState(null) // começa pq não existe usuario
    const [loadingAuth, setAuthLoading] = useState( false ) // loading do login
    const [loading, setLoading] = useState(true) //loading geral, quando abre a aplicação
    
    //Montando a aplicação com usuario do local storage caso haja um
    useEffect( () => {
        // Procura no local Storage
        function loadingStorage() {
            const storageUser = localStorage.getItem( 'Sistema_User' ) 
        
            // vendo se há alguns usuario no localStorage
            if ( storageUser ) {
                setUser( JSON.parse( storageUser ) ) // se tiver algo, mandar para o estado setUser
                setLoading(false)
            }
            setLoading(false)
        }

       loadingStorage()

    }, [] )
    
    // cadastrando novo usuario no Firebase
    async function casdastrarFireBase(email, password, nome) {
        setAuthLoading( true ) // mudou pra true, pq tem alguem querendo cadastrar
        
        await firebase.auth().createUserWithEmailAndPassword( email, password)
        .then(async ( value ) => { // caso de sucesso, recebe value com informações do usuario cadastrado
           // transformando a função em assincrona para poder relacionar com o banco de dados do firebase
            let uid = value.user.uid

            // Indo no banco cadastrar
            await firebase.firestore().collection( 'users' )
            .doc( uid ) // falando criar um doc com a variavel que recebe o uid
            .set( { // o que vai ser enviado para a coleção
                nome: nome,
                avatarUrl: null
            } )
            /*Depois de cadastrar usuario, cadastrou no banco esse usuario,
             agora é disponibilizar esse dados para estado de user    
            */
            .then( () => {
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    avatarUrl: null   
                }
                 // Passando para estado user atraves de setUser
                setUser( data )
                saveStorageUser( data )
                setAuthLoading( false ) // cadastro finalizado
                toast.success('Cadastrado com sucesso!')
            } )

        } )
            .catch( erro => {
                console.log( erro )
                toast.error('Erro ao cadastrar, Tente mais tarde')
                setAuthLoading( false )
                
            } )
    }

    // Salvar no localStorage esse usuario novo
    function saveStorageUser( data ) {
        localStorage.setItem('Sistema_User', JSON.stringify(data))
    }

    // Login de usuario
    async function logar(email, password) {
        setAuthLoading( true )
        
        // Indo no firebase buscar email e senha
        await firebase.auth().signInWithEmailAndPassword( email, password )
        .then(async ( value ) => {  // recebendo a response da promisse, pegando uid
            let uid = value.user.uid;
            
            const userProflie = await firebase.firestore().collection( 'users' )
                .doc( uid ).get()
            
            // utilizando valor da reposta do firebase armazenando em userProfile
            let data = {
                uid: uid,
                nome: userProflie.data().nome,
                avatarUrl: userProflie.data().avatarUrl,
                email: value.user.email
            }
             // Passando para estado user atraves de setUser
             setUser( data )
             saveStorageUser( data )
            setAuthLoading( false ) // cadastro finalizado
            toast.success('Bem vindo ao sistema')
        } )
        .catch( ( erro ) => {
            console.log( erro );
            toast.error('Ops!, algo errado')
            setAuthLoading( false )
            
        } )

    }


    // Deslogando do sistema
    async function deslogarFirebase() {
        await firebase.auth().signOut()
        localStorage.removeItem( 'Sistema_User' )
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{
            logado: !!user,
            user,
            loading,
            casdastrarFireBase,
            deslogarFirebase,
            logar,
            loadingAuth,
            setUser,
            saveStorageUser

        }}>                         {/* !! esta convertendo o que estiver dentro do estado user em booleano*/}
            
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;