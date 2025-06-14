import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    viewChild,
} from '@angular/core';
import { MonthlyExpense } from '../../models/monthlyExpense';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';
import { RefreshService } from '../../services/refresh.service';
import { MonthlyExpForm } from '../../forms/monthlyExpForm';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-monthly-exp-display',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatMenuModule,
        MatInputModule,
        MatIconModule,
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

    fg: FormGroup<MonthlyExpForm>;
    isEditing = false;

    constructor() {}

    ngOnInit(): void {
        this.initForm();
    }

    onAddNew() {
        this.apiService
            .addMonthlyExpense(this.fg.value as MonthlyExpense)
            .subscribe((resp) => {
                if (resp.success) {
                    this.refreshService.triggerRefresh();
                    this.menuTrigger()?.closeMenu();
                } else {
                    console.error(resp.message);
                }
                this.fg.reset();
            });
    }

    private initForm() {
        const fg = new FormGroup<MonthlyExpForm>({
            category: new FormControl('', [Validators.required]),
            amount: new FormControl(0, [
                Validators.min(0),
                Validators.required,
            ]),
        });
        this.fg = fg;
    }
}
