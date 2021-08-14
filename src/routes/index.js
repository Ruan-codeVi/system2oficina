import { Switch } from 'react-router-dom'
import Route from './Route'
import SignIn from'../pages/SignIn'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Customers from '../pages/Customers'
import New from '../pages/New'
import Editar from '../pages/Editar'


export default function Routes() {
    return (
        <Switch>
            <Route exact path='/' component={SignIn }/>
            <Route exact path='/cadastro' component={SignUp }/>
            <Route exact path='/dashboard' component={Dashboard } isPrivate/>
            <Route exact path='/profile' component={Profile } isPrivate/>
            <Route exact path='/clientes' component={Customers } isPrivate/>
            <Route exact path='/novo' component={New } isPrivate/>
            <Route exact path='/editar/:id' component={Editar} isPrivate/>
        </Switch>
    )
}