import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MainService {
    subscription = new Subject();
    resizeColumn() {
        this.subscription.next();
    }
}
