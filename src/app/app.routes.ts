import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { Tasks } from './tasks/tasks/tasks';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'tasks',
        canActivate: [authGuard],
        component: Tasks
    }
];
