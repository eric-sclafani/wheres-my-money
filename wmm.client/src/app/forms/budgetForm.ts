import { FormControl } from '@angular/forms';

export interface BudgetForm {
    cashIn: FormControl<number | null>;
    cashOut: FormControl<number | null>;
    disposableIncome: FormControl<number | null>;
}
