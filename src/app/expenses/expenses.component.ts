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
  tableInfo : { title : string, field : string }[] = [
      { title : "Nom", field : "clientName"},
      { title : "Description", field : "description"},
      { title : "Mode de paiement", field : "paymentMethod"},
      { title : "Prix", field : "price"},
      { title : "Numero cheque", field : "checkNumber"},
      { title : "RIB", field : "RIB"},
      { title : "Frais bancaire", field : "bankFee"}
  ]

  constructor(private apiService : ApiService){}
  flattenObject(obj : any) : any {
    let res : any = {};
    for (const key in obj){
      if((typeof obj[key]) === 'object' && !Array.isArray(obj[key])){
        const temp = this.flattenObject(obj[key]);
        for(const nestedKey in temp){
          res[nestedKey] = temp[nestedKey]
        }
      }else{
        res[key] = obj[key];
      }
    }
    return res;
  }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(){
    const items = this.apiService.getItems('expenses').subscribe((data : any) => {
      this.expenses = data.map((elem : any) => this.flattenObject(elem));
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
