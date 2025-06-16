import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    viewChild,
    ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Purchase } from '../../models/purchase';
import { Subject, takeUntil } from 'rxjs';
import { RefreshService } from '../../services/refresh.service';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ColumnFilter } from '../../models/columnFilter';
import { Column, columns } from './columns';
import { ApiService } from '../../services/api.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PurchaseForm } from '../../forms/purchaseForm';
import { Budget } from '../../models/budget';

@Component({
    selector: 'app-purchase-table',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatButtonModule,
        MatMenuModule,
        MatInputModule,
        DatePipe,
        CurrencyPipe,
    ],
    templateUrl: './purchase-table.component.html',
    styleUrl: './purchase-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DatePipe, CurrencyPipe],
})
export class PurchaseTableComponent {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    menuTrigger = viewChild(MatMenuTrigger);

    private readonly destroy$ = new Subject<void>();
    private readonly refreshService = inject(RefreshService);
    private readonly apiService = inject(ApiService);
    private readonly fb = inject(FormBuilder);
    private readonly datePipe = inject(DatePipe);

    columns = columns;
    displayedColumns: string[];
    dataSource = new MatTableDataSource<Purchase>();

    colFilterFg: FormGroup;
    addEditFg: FormGroup<PurchaseForm>;

    purchases = input.required<Purchase[]>();
    budget = input.required<Budget>();
    displayData = computed(() => {
        return this.purchases().sort((a, b) => (a.id > b.id ? 1 : 0));
    });

    editingId = 0;

    constructor() {
        this.initColSearchFilters();

        effect(() => {
            this.dataSource.data = this.computeBalances(
                this.displayData(),
                this.budget()
            );
        });
    }

    ngOnInit(): void {
        this.displayedColumns = this.columns.map(
            (col: Column) => col.columnDef
        );

        this.initTableForm();
        this.initFormGroupSubscription();
        this.initAddEditFg();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onAddNew() {
        this.apiService
            .addPurchase(this.addEditFg.value as Purchase)
            .subscribe((resp) => {
                if (resp.success) {
                    this.refreshService.triggerRefresh();
                    this.menuTrigger()?.closeMenu();
                }
            });
    }

    onEditSubmit() {
        const purchase = this.addEditFg.value as Purchase;
        console.log(purchase);
        purchase.id = this.editingId;

        this.apiService.updatePurchase(purchase).subscribe((resp) => {
            if (resp.success) {
                this.refreshService.triggerRefresh();
                this.editingId = 0;
                this.addEditFg.reset();
            }
        });
    }

    onMenuClosed() {
        this.addEditFg.reset();
    }

    onRowDblClick(purchase: Purchase) {
        this.editingId = purchase.id;
        purchase.date = this.datePipe.transform(
            purchase.date,
            'yyyy-MM-dd'
        ) as string;
        this.addEditFg.patchValue(purchase);
    }

    onDelete(purchase: Purchase) {
        this.apiService.deletePurchase(purchase.id).subscribe((resp) => {
            if (resp.success) {
                this.refreshService.triggerRefresh();
            }
        });
    }

    private computeBalances(purchases: Purchase[], budget: Budget): Purchase[] {
        if (budget != null && budget.disposableIncome != null) {
            let balance = budget.disposableIncome;
            purchases.forEach((p) => {
                p.balance = balance - p.amount;
                balance = balance - p.amount;
            });
        }

        return purchases;
    }

    private initAddEditFg(): void {
        const fg = new FormGroup<PurchaseForm>({
            date: new FormControl<string | null>(null, [Validators.required]),
            description: new FormControl<string | null>(null, [
                Validators.required,
            ]),
            vendor: new FormControl<string | null>(null, [Validators.required]),
            tag: new FormControl<string | null>(null, [Validators.required]),
            type: new FormControl<string | null>(null),
            amount: new FormControl<number | null>(null, [Validators.required]),
        });
        this.addEditFg = fg;
    }

    private initTableForm(): void {
        let formGroupConfig: Record<string, FormControl> = {};
        this.columns
            .map((col: Column) => col.columnDef)
            .forEach((colName) => {
                formGroupConfig[colName] = new FormControl('', {
                    nonNullable: true,
                });
            });
        this.colFilterFg = this.fb.group(formGroupConfig);
    }

    private initColSearchFilters(): void {
        this.dataSource.filterPredicate = (
            data: Record<string, any>,
            filter: string
        ) => {
            const columnFilters: ColumnFilter[] = JSON.parse(filter);
            return columnFilters.every((f) => {
                let isMatch = true;

                const dataValue = `${data[f.name]}`;
                const filterValue = f.value?.toLowerCase();

                if (f.type == 'date' && dataValue != 'null') {
                    const formattedDate = this.datePipe
                        .transform(dataValue, 'MM/dd/yyyy')
                        ?.toLowerCase();

                    if (formattedDate != undefined) {
                        isMatch =
                            isMatch && formattedDate.includes(filterValue);
                    }
                } else {
                    if (dataValue) {
                        isMatch =
                            isMatch &&
                            dataValue.toLowerCase().includes(filterValue);
                    }
                }

                return isMatch;
            });
        };
    }

    private initFormGroupSubscription(): void {
        this.colFilterFg.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: Purchase) => {
                const filter: Record<string, any> = { ...filterData };

                if (Object.values(filter).every((s) => s == '' || s == null)) {
                    this.dataSource.filter = '';
                } else {
                    let filterGroup: ColumnFilter[] = this.columns.map(
                        (col: Column) => {
                            return {
                                name: col.columnDef,
                                value: filter[col.columnDef],
                                type: col.type ?? '',
                            };
                        }
                    );
                    const stringified = JSON.stringify(filterGroup);
                    this.dataSource.filter = stringified;
                }
            });
    }

    resetColumnFilters(): void {
        this.colFilterFg.reset();
    }
}
