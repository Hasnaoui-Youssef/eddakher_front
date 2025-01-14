import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'

  constructor(private http : HttpClient) { }

  getItems(endpoint : string){
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }
  addItem(endpoint : string, data : any){
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }
  deleteItem(endpoint : string, id : string){
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}`);
  }
  getMonthlyItems( month : number, year : number){
    return this.http.post(`${this.baseUrl}/monthly`, {
      month,
      year
    });
  }
}
