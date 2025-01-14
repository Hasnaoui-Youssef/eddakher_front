import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

export interface PaymentDetailsInfo{
  price : number
}

export interface CashDetails extends PaymentDetailsInfo {}

export interface CheckDetails extends PaymentDetailsInfo {
  checkNumber : string;
}
export interface VirementDetails extends PaymentDetailsInfo {
  RIB : string;
  bankFee : number;
}
export enum PaymentMethod {
  Cash = 'cash',
  Check = 'check',
  Virement = 'virement'
}
export interface ExpenseDto {
  clientName : string;
  description : string;
  paymentMethod : PaymentMethod;
  price : number;
  date? : string;
}

@Component({
  selector: 'app-expenses',
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {
  expenses : any[] = [];
  showDialog : boolean = false;
  showContextMenu : boolean = false;
  contextMenuPosition = {x : 0, y : 0};
  selectedRow : number | null = null;
  currentDialogPage : number = 0;
  tableInfo : { title : string, field : string }[] = [
      { title : "Nom", field : "clientName"},
      { title : "Description", field : "description"},
      { title : "Mode de paiement", field : "paymentMethod"},
      { title : "Prix", field : "price"},
      { title : "Numero cheque", field : "checkNumber"},
      { title : "RIB", field : "RIB"},
      { title : "Frais bancaire", field : "bankFee"}
  ]
  newExpense : ExpenseDto = { clientName : '', description : '', paymentMethod : PaymentMethod.Cash, price : 0};
  newExpenseCheckNumber : string = '';
  newExpenseRIB : string = '';
  newExpenseBankFee : number = 0;
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
      console.log(this.expenses)
    })
  }

  deleteExpense(index : number | null) {
    if(index !== null){
      const id = this.expenses[index]._id;
      this.apiService.deleteItem('expenses', id).subscribe(() => {
        this.loadExpenses();
      });
    }
    this.showContextMenu = false;
  }
  onRowRightClick(event : MouseEvent, index : number){
    event.preventDefault();
    this.selectedRow = index;
    this.contextMenuPosition = { x : event.pageX, y : event.pageY };
    this.showContextMenu = true; 
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event : MouseEvent){
    this.showContextMenu = false;
  }
  openDialog(){
    this.showDialog = true;
    this.currentDialogPage = 1;
  }
  closeDialog(){
    this.showDialog = false;
    this.resetForm();
  }
  resetForm(){
    this.newExpense = { clientName : '', description : '', paymentMethod : PaymentMethod.Cash, price : 0};
    this.newExpenseBankFee = 0;
    this.newExpenseCheckNumber = '';
    this.newExpenseRIB = '';
  }
  submitExpense(){
    const transferObject : any = {...this.newExpense}
    switch(transferObject.paymentMethod){
      case PaymentMethod.Cash : {
        transferObject["paymentDetails"] = {price : transferObject.price};
        break;
      }
      case PaymentMethod.Check:{
        transferObject["paymentDetails"] = {
          price : transferObject.price,
          checkNumber : this.newExpenseCheckNumber
        }
        break;
      }
      case PaymentMethod.Virement : {
        transferObject["paymentDetails"] = {
          price : transferObject.price,
          RIB : this.newExpenseRIB,
          bankFee : this.newExpenseBankFee
        }
      }
    }
    delete transferObject['price'];
    console.log(transferObject);
    this.showDialog = false;
    this.resetForm();
    this.apiService.addItem('expenses', transferObject).subscribe((_) => this.loadExpenses());
  }
  nextPageDialog(){
    this.currentDialogPage = 2;
  }
  previousPageDialog(){
    this.currentDialogPage = 1;
  }
}