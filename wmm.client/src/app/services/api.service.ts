import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Budget } from '../models/budget';
import { MonthlyExpense } from '../models/monthlyExpense';
import { Purchase } from '../models/purchase';
import { DynamicResult } from '../models/dynamicResult';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly expenseUrl = 'http://localhost:5249/api/MonthlyExpense/';
    private readonly budgetUrl = 'http://localhost:5249/api/Budget/';
    private readonly purchaseUrl = 'http://localhost:5249/api/Purchase/';

    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse) {
        return throwError(() => error);
    }

    private get<T>(url: string): Observable<DynamicResult<T>> {
        return this.http.get<DynamicResult<T>>(url);
    }

    private post<T>(url: string, data: any): Observable<DynamicResult<T>> {
        return this.http
            .post<DynamicResult<T>>(url, data)
            .pipe(catchError(this.handleError));
    }

    private delete<T>(url: string): Observable<DynamicResult<T>> {
        return this.http
            .delete<DynamicResult<T>>(url)
            .pipe(catchError(this.handleError));
    }

    private patch<T>(url: string, data: T): Observable<DynamicResult<T>> {
        return this.http.patch<DynamicResult<T>>(url, data);
    }

    fetchBudget() {
        return this.get<Budget>(this.budgetUrl + 'GetBudget');
    }

    setCashIn(budget: Budget) {
        return this.post<Budget>(this.budgetUrl + 'SetCashIn', budget);
    }

    fetchMonthlyExpenses() {
        return this.get<MonthlyExpense[]>(
            this.expenseUrl + 'GetMonthlyExpenses'
        );
    }

    addMonthlyExpense(exp: MonthlyExpense) {
        return this.post<MonthlyExpense>(
            this.expenseUrl + 'AddMonthlyExpense',
            exp
        );
    }

    deleteMonthlyExpense(id: number) {
        return this.delete<MonthlyExpense>(
            this.expenseUrl + `DeleteMonthlyExpense?id=${id}`
        );
    }

    updateMonthlyExpense(exp: MonthlyExpense) {
        return this.patch<MonthlyExpense>(
            this.expenseUrl + 'UpdateMonthlyExpense',
            exp
        );
    }

    fetchPurchases() {
        return this.get<Purchase[]>(this.purchaseUrl + 'GetPurchases');
    }

    addPurchase(purchase: Purchase) {
        return this.post(this.purchaseUrl + 'AddPurchase', purchase);
    }

    updatePurchase(purchase: Purchase) {
        return this.patch(this.purchaseUrl + 'UpdatePurchase', purchase);
    }

    deletePurchase(id: number) {
        return this.delete<Purchase>(
            this.purchaseUrl + `DeletePurchase?id=${id}`
        );
    }
}
