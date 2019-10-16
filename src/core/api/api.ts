import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

const apiUrl = "http://166.62.54.122/kidswandarland/wp-json/wc/v3/";

@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient) {
  }

  post(link,data){
  	return this.http.post(apiUrl+link, data).map(response => {
      	return response;
    });

  }
//   get(data){
//     return this.http.post(apiUrl+'/users/',data).map(response => {
//         return response;
//   });

// }

}

