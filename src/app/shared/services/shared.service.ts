import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SharedService {
    subscription = new Subject();

    setUserMenu(userMenuArr) {
        console.log('userMenuArr : ', userMenuArr);
        this.subscription.next(userMenuArr);
        // this.subscription.complete();
    }

    getUserMenu(): Observable<any> {
        console.log('trial get User Menu..');
        return this.subscription.asObservable();
    }
}
