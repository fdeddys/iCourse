import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { RoleMenuModule } from './role-menu/role-menu.module';
import { RoleUserModule } from './role-user/role-user.module';
import { AuditTrailModule } from './audit-trail/audit-trail.module';
import { AccessMatrixModule } from './access-matrix/access-matrix.module';
import { OutletGroupModule } from './outlet-group/outlet-group.module';
import { OutletModule } from './outlet/outlet.module';
import { ClassesModule } from './classes/classes.module';
import { RoomModule } from './room/room.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { RegistrationModule } from './registration/registration.module';
import { AttendanceModule } from './attendance/attendance.module';



@NgModule({
    imports: [
        UserModule,
        RoleModule,
        MenuModule,
        RoleMenuModule,
        RoleUserModule,
        AuditTrailModule,
        AccessMatrixModule,
        OutletGroupModule,
        OutletModule,
        ClassesModule,
        RoomModule,
        TeacherModule,
        StudentModule,
        RegistrationModule,
        AttendanceModule,
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],

})
export class EntityModule {}
