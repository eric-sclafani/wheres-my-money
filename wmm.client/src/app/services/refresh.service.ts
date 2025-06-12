import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RefreshService {
    private refresh = new Subject<void>();

    triggerRefresh(): void {
        this.refresh.next();
    }

    get onRefresh(): Observable<void> {
        return this.refresh.asObservable();
    }
}
