import { Subject } from 'rxjs';

export interface MainChild {
    resizeColumn();
}
let subscription;
export function eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && subscription) {
        subscription.unsubscribe();
    } else {
        subscription = action.subscribe(() => handler());
    }
}
