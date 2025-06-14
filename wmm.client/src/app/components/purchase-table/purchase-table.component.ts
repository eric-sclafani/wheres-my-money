import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
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
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ColumnFilter } from '../../models/columnFilter';
import { Column, columns } from './columns';

@Component({
    selector: 'app-purchase-table',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        ReactiveFormsModule,
        MatPaginatorModule,
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

    private readonly destroy$ = new Subject<void>();
    private readonly refreshService = inject(RefreshService);
    private readonly fb = inject(FormBuilder);
    private readonly datePipe = inject(DatePipe);

    columns = columns;
    displayedColumns: string[];
    dataSource = new MatTableDataSource<Purchase>();

    fg: FormGroup;

    purchases = input.required<Purchase[]>();

    constructor() {
        this.initColSearchFilters();

        effect(() => {
            this.dataSource.data = this.purchases();
        });
    }

    ngOnInit(): void {
        this.displayedColumns = this.columns.map(
            (col: Column) => col.columnDef
        );

        this.initTableForm();
        this.initFormGroupSubscription();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
        this.fg = this.fb.group(formGroupConfig);
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
        this.fg.valueChanges
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
        this.fg.reset();
    }
}
