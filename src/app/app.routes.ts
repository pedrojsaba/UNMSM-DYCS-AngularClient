import { RouterModule, Routes, Router} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const APP_ROUTES: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

export const app_routing = RouterModule.forRoot(APP_ROUTES);

