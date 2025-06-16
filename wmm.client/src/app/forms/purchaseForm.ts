import { FormControl } from '@angular/forms';

export interface PurchaseForm {
    date: FormControl<string | null>;
    description: FormControl<string | null>;
    vendor: FormControl<string | null>;
    tag: FormControl<string | null>;
    type: FormControl<string | null>;
    amount: FormControl<number | null>;
}
