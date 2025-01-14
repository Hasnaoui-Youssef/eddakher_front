import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expenses',
  imports: [CommonModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {
  expenses : any[] = [];
  uniqueKeys : string[] = ["clientName", "description", "paymentMethod", "paymentDetails", "date"];

  constructor(private apiService : ApiService){}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(){
    const items = this.apiService.getItems('expenses').subscribe((data : any) => {
      this.expenses = data;
    })
  }

  addExpense(expense : any){
    this.apiService.addItem('expenses', expense).subscribe((data : any) => {
      this.loadExpenses();
    })
  }
  deleteExpense(id: string) {
    this.apiService.deleteItem('expenses', id).subscribe(() => {
      this.loadExpenses();
    });
  }
}
