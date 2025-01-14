import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monthly',
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly.component.html',
  styleUrl: './monthly.component.css'
})
export class MonthlyComponent implements OnInit {
  data : any = {};
  showDialog : boolean = false;
  queryYear : number | null = null;
  queryMonth : number | null = null;
  expenseTitleInfo : {title : string; field : string}[] = [
      { title : "Nom", field : "clientName"},
      { title : "Description", field : "description"},
      { title : "Mode de paiement", field : "paymentMethod"},
      { title : "Prix", field : "price"},
      { title : "Numero cheque", field : "checkNumber"},
      { title : "RIB", field : "RIB"},
      { title : "Frais bancaire", field : "bankFee"}
  ]
  economiesTitleInfo :{title : string; field : string}[] = [
    { title : "Prix", field : "amount"},
    { title : "Description", field : "description"}
  ] 
  revenuesTitleInfo :{title : string; field : string}[] = [
    { title : "Nom" , field : "clientName"},
    { title : "Prix", field : "amount"},
    { title : "Description", field : "description"}
  ] 
  reportTitleInfo : {title : string; field : string}[] = [
    {title : "Gain totales", field : "totalGains"},
    {title : "Depenses totales", field : "totalExpenses"},
    {title : "Net", field : "net"}
  ]
  months : string[] = [
    'Janvier', 'Fevrier', 'Mars', 'Avril', 'May', 'Juin',
    'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
  ];

  constructor( private apiService : ApiService ){}
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
      this.initialLoadData();
  }
  initialLoadData(){
    const date = new Date();
    this.apiService.getMonthlyItems(date.getMonth() + 1, date.getFullYear()).subscribe((data : any) => {
      this.data = data
      const flatExpenses = data.expenses.map((expense : any) => this.flattenObject(expense));
      this.data.expenses = flatExpenses;
      console.log(data);
    });
  }
  loadData(){
    if(this.queryMonth !== null && this.queryYear !== null){
      if(this.queryYear > new Date().getFullYear() || this.queryYear < 1970) return ;
      this.apiService.getMonthlyItems(this.queryMonth, this.queryYear).subscribe((data : any) =>{
        this.data = data
        const flatExpenses = data.expenses.map((expense : any) => this.flattenObject(expense));
        this.data.expenses = flatExpenses;
      });
    }else{
      this.initialLoadData();
    }
    this.queryMonth = null;
    this.queryYear = null;
    this.showDialog = false;
  }
  openDialog(){
    this.showDialog = true;
  }
  closeDialog(){
    this.showDialog = false;
    this.queryMonth = null;
    this.queryYear = null;
  }
}
