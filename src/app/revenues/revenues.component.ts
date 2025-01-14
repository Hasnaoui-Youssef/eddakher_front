import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

export interface RevenueDto{
  clientName : string;
  amount : number;
  description : string;
  date? : string;
}

@Component({
  selector: 'app-revenues',
  imports: [CommonModule, FormsModule],
  templateUrl: './revenues.component.html',
  styleUrl: './revenues.component.css'
})
export class RevenuesComponent implements OnInit{
  revenues : any[] = [];
  showDialog : boolean = false;
  showContextMenu : boolean = false;
  contextMenuPosition = {x : 0, y : 0};
  selectedRow : number | null = null;
  tableInfo : {title : string, field  : string}[] = [
    { title : "Nom", field : "clientName" },
    { title : "Prix", field : "amount"},
    { title : "Description", field : "description"}
  ];
  newRevenue : RevenueDto = { clientName : '', amount : 0, description : ''};
  constructor(private apiService : ApiService){}
  ngOnInit(): void {
     this.loadRevenues(); 
  }
  loadRevenues(){
    this.apiService.getItems('revenue').subscribe((data : any) => {
      this.revenues = data;
    })
  }
  deleteRevenue(index : number | null){
    if(index !== null){
      const id = this.revenues[index]._id;
      this.apiService.deleteItem('revenue', id).subscribe((_) => {
        this.loadRevenues();
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
    this.newRevenue = { clientName : '', amount : 0, description : ''}
  }
  submitRevenue(){
    this.showDialog = false;
    this.apiService.addItem('revenue', this.newRevenue).subscribe((_) => {
      this.loadRevenues();
    })
  }

}
