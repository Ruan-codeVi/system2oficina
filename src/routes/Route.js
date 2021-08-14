import {useContext} from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../contexts/auth';
export default function RouteWrapper( {
    component: Component,
    isPrivate,
    ...rest
} ) {
    const {logado, loading} = useContext(AuthContext)
   
    
    // Se loading for true
    if ( loading ) {
        return (
            <div>
                <h1>Carregando...</h1>
            </div>
        );
    }
    // Se não estiver logado e tentar alguma rota privada, redirect para login
    if ( !logado && isPrivate) {
        return (
            <Redirect to= '/'/>
        );
    }
    // Se estiver logado e não for uma rota privada, redirect para dashboard
    if ( logado && !isPrivate ) {
        return (
            <Redirect to ='/dashboard'/>
        );
    }
    return(
        <Route
            {...rest}
            render={props => (
                <Component {...props}/>
            )}
        />
    )
}