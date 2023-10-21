import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private controllerUrl = 'user-tests/';

  constructor(private http: HttpClient) { }
   GetEvaluation(data: any,id:string): Promise<any> {
    
    return axios.get(environment.apiUrl+this.controllerUrl+id, {
      params: data
    })
    .then((response) => {
      return response.data.test;
      })      
    .catch(function (error: any) {
      return error;
    });
  }
  
}
