import { FormControl } from '@angular/forms';

export interface MonthlyExpForm {
    category: FormControl<string | null>;
    amount: FormControl<number | null>;
}
