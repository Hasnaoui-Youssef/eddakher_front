import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

export interface EconomyDto {
  amount : number;
  description : string;
  date? : string;
}

@Component({
  selector: 'app-economies',
  imports: [CommonModule, FormsModule],
  templateUrl: './economies.component.html',
  styleUrl: './economies.component.css'
})
export class EconomiesComponent implements OnInit {
  economies : any[] = [];
  showDialog : boolean = false;
  showContextMenu : boolean = false;
  contextMenuPosition = {x : 0, y : 0};
  selectedRow : number | null = null;
  tableInfo : {title : string, field  : string}[] = [
    { title : "Prix", field : "amount"},
    { title : "Description", field : "description"}
  ];
  newEconomy : EconomyDto = { amount : 0, description : ''};
  constructor(private apiService : ApiService){}
  ngOnInit(): void {
     this.loadEconomies(); 
  }
  loadEconomies(){
    this.apiService.getItems('economy').subscribe((data : any) => {
      this.economies = data;
    })
  }
  deleteEconomy(index : number | null){
    if(index !== null){
      const id = this.economies[index]._id;
      this.apiService.deleteItem('economy', id).subscribe((_) => {
        this.loadEconomies();
      })
    }
  }
  onRowRightClick(event : MouseEvent, index : number){
    event.preventDefault();
    this.selectedRow = index;
    this.contextMenuPosition = { x : event.pageX, y : event.pageY};
    this.showContextMenu = true;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event : MouseEvent){
    this.showContextMenu = false;
  }
  openDialog(){
    this.showDialog = true;
  }
  closeDialog(){
    this.showDialog = false;
    this.resetForm();
  }
  resetForm(){
    this.newEconomy = { amount : 0, description : ''}
  }
  submitEconomy(){
    this.showDialog = false;
    this.apiService.addItem('economy', this.newEconomy).subscribe((_) => {
      this.loadEconomies();
    })
  }
}
