import { Routes } from '@angular/router';
import { ExpensesComponent } from './expenses/expenses.component';
import { RevenuesComponent } from './revenues/revenues.component';
import { EconomiesComponent } from './economies/economies.component';
import { MonthlyComponent } from './monthly/monthly.component';

export const routes: Routes = [
    { path : 'expenses', component : ExpensesComponent},
    { path : 'revenues', component : RevenuesComponent},
    { path : 'economies', component : EconomiesComponent},
    { path : 'monthly', component : MonthlyComponent},
    { path : '', redirectTo : '/mothly', pathMatch : 'full'}
];
