import { Component } from '@angular/core';

@Component({
  selector: 'app-monthly',
  imports: [],
  templateUrl: './monthly.component.html',
  styleUrl: './monthly.component.css'
})
export class MonthlyComponent {
  data : any;
  expenseTitleInfo : {title : string; field : string}[] = []
}
