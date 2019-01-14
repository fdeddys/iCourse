import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './layouts/main/main.component';
import { LoginComponent } from './shared/login/login.component';
import { Error404Component } from './shared/404/404.component';
import { UserComponent, UserUpdatePasswordComponent } from './entities/user';
import { RoleComponent } from './entities/role/role.component';
import { MenuComponent } from './entities/menu';
import { AccessMatrixComponent } from './entities/access-matrix';
import { OutletGroupComponent } from './entities/outlet-group';
import { OutletComponent } from './entities/outlet';
import { RoomComponent } from './entities/room';
import { ClassesComponent } from './entities/classes';
import { TeacherComponent } from './entities/teacher';
import { StudentComponent } from './entities/student';
import { RegistrationComponent } from './entities/registration';
import { AttendanceComponent } from './entities/attendance';


const routes: Routes = [
    { path : '', component : LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: '404', component: Error404Component },
    {
        path: 'main',
        component: MainComponent,
        children: [
            {path: '404', component: Error404Component},
            {path: 'user', component: UserComponent},
            {path: 'role', component: RoleComponent},
            {path: 'menu', component: MenuComponent },
            {path: 'change-pass', component: UserUpdatePasswordComponent},
            {path: 'access-matrix', component: AccessMatrixComponent},
            {path: 'group-outlet', component: OutletGroupComponent},
            {path: 'outlet', component: OutletComponent},
            {path: 'room', component: RoomComponent},
            {path: 'classes', component: ClassesComponent},
            {path: 'teacher', component: TeacherComponent},
            {path: 'student', component: StudentComponent},
            {path: 'registration', component: RegistrationComponent},
            {path: 'attendance', component: AttendanceComponent}
        ]
    },
    { path: '**', redirectTo: '/main/404', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: true})
        // RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
