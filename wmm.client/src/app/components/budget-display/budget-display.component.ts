import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    OnInit,
    signal,
    viewChild,
} from '@angular/core';
import { Budget } from '../../models/budget';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { BudgetForm } from '../../forms/budgetForm';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RefreshService } from '../../services/refresh.service';

@Component({
    selector: 'app-budget-display',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatButtonModule,
    ],
    templateUrl: './budget-display.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './budget-display.component.scss',
})
export class BudgetDisplayComponent implements OnInit {
    private readonly apiService = inject(ApiService);
    private readonly refreshService = inject(RefreshService);
    menuTrigger = viewChild(MatMenuTrigger);

    budget = input.required<Budget>();
    cashIn = computed(() => this.budget().cashIn);

    fg: FormGroup<BudgetForm>;
    isEditing = signal(false);

    constructor() {
        effect(() => {
            this.fg.patchValue(this.budget());
        });
    }

    ngOnInit(): void {
        this.initForm();
    }

    onSubmit(): void {
        this.apiService.setCashIn(this.fg.value as Budget).subscribe((resp) => {
            if (resp.success) {
                this.refreshService.triggerRefresh();
                this.menuTrigger()?.closeMenu();
            }
        });
    }

    private initForm(): void {
        this.fg = new FormGroup<BudgetForm>({
            cashIn: new FormControl(0, [
                Validators.required,
                Validators.min(0),
            ]),
            cashOut: new FormControl(0),
            disposableIncome: new FormControl(0),
        });
    }
}
