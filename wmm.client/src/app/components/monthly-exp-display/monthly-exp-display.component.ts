import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    OnInit,
    viewChild,
} from '@angular/core';
import { MonthlyExpense } from '../../models/monthlyExpense';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';
import { RefreshService } from '../../services/refresh.service';

@Component({
    selector: 'app-monthly-exp-display',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatMenuModule,
        MatInputModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './monthly-exp-display.component.html',
    styleUrl: './monthly-exp-display.component.scss',
})
export class MonthlyExpDisplayComponent implements OnInit {
    private readonly apiService = inject(ApiService);
    private readonly refreshService = inject(RefreshService);
    menuTrigger = viewChild(MatMenuTrigger);

    monthlyExpenses = input.required<MonthlyExpense[]>();

    constructor() {
        effect(() => {});
    }

    ngOnInit(): void {}
}
