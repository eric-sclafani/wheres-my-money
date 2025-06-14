import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit,
    signal,
} from '@angular/core';
import { ApiService } from './services/api.service';
import { BudgetDisplayComponent } from './components/budget-display/budget-display.component';
import { Purchase } from './models/purchase';
import { Budget } from './models/budget';
import { MonthlyExpense } from './models/monthlyExpense';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { RefreshService } from './services/refresh.service';
import { MonthlyExpDisplayComponent } from './components/monthly-exp-display/monthly-exp-display.component';
import { PurchaseTableComponent } from './components/purchase-table/purchase-table.component';

@Component({
    selector: 'app-root',
    imports: [
        BudgetDisplayComponent,
        MonthlyExpDisplayComponent,
        PurchaseTableComponent,
    ],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
    private readonly apiService = inject(ApiService);
    private readonly refreshService = inject(RefreshService);
    private readonly destroy$ = new Subject<void>();

    purchases = signal<Purchase[]>([]);
    budget = signal<Budget>(new Budget());
    monthlyExp = signal<MonthlyExpense[]>([]);

    ngOnInit(): void {
        this.fetchData();

        this.refreshService.onRefresh
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.fetchData());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private fetchData(): void {
        forkJoin([
            this.apiService.fetchBudget(),
            this.apiService.fetchPurchases(),
            this.apiService.fetchMonthlyExpenses(),
        ]).subscribe(([budget, purchases, expenses]) => {
            this.purchases.set(purchases.data ?? []);
            this.budget.set(budget.data ?? new Budget());
            this.monthlyExp.set(expenses.data ?? []);
        });
    }
}
