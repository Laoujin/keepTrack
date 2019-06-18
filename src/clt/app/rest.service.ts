import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

//const endpoint = environment.apiUrl;
const endpoint = 'http://localhost:1945/api/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }
    
  private extractData(res: Response) {
      let body = Object.keys(res);
      //let body = res;
      return body || { };
    }
    
getLogs(): Observable<any> {
  return this.http.get(endpoint + 'logs').pipe(
    map(this.extractData),
  );
}

getLog(id): Observable<any> {
  return this.http.get(endpoint + 'logs/' + id).pipe(
    map(this.extractData));
}

addLog(log): Observable<any> {
  console.log(log);
  return this.http.post<any>(endpoint + 'logs', JSON.stringify(log), httpOptions).pipe(
    tap((log) => console.log(`added log w/ id=${log.id}`)),
    catchError(this.handleError<any>('addLog'))
  );
}

updateLog(id, log): Observable<any> {
  return this.http.put(endpoint + 'logs/' + id, JSON.stringify(log), httpOptions).pipe(
    tap(_ => console.log(`updated log id=${id}`)),
    catchError(this.handleError<any>('updateLog'))
  );
}

deleteLog(id): Observable<any> {
  return this.http.delete<any>(endpoint + 'logs/' + id, httpOptions).pipe(
    tap(_ => console.log(`deleted log id=${id}`)),
    catchError(this.handleError<any>('deleteLog'))
  );
}    
    
    
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    console.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

}