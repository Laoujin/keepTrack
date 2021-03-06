//Connection to the api Server

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, filter, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { logModel } from './logModel';
import { userModel } from './userModel';
import { logitemModel } from './logitemModel';

const endpoint = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
     // 'Content-Type':  'application/x-www-form-urlencoded'
  })
};

@Injectable({
  providedIn: 'root'
})

export class RestService {
 
  constructor(private http: HttpClient) { }
    
  private extractLogs(res: Response) {
      const logs = [];
      const body = Object(res['fetshedPosts']);
      return body || { }; 
  }

  private extractLog(res: Response) {
      const logs = [];
      const body = Object(res['timelog']);
      return body || { }; 
  }

  private userLogin(res: Response) {
      const userBlock = [];
      const body = Object(res['userLogin']);
      return body || { }; 
  }

checkLogin(key:string): Observable<userModel[]> {
    return this.http.get<userModel[]>(endpoint + 'login/' + key)
    .pipe(
        //tap(_ => console.log(`Check login for ${key}`)),
        catchError(this.handleError(`Failed to Get user`)),
        map(this.userLogin)
    );
}

getLogs(key:string, logsPerPage: number, currentPage: number): Observable<logModel[]> {
  const queryParams = `?pagesize=${logsPerPage}&page=${currentPage}`;
  return this.http.get<logModel[]>(endpoint + key+'/logs' + queryParams)
    .pipe(
        //tap(_ => console.log(`get logs for ${key}`)),
        catchError(this.handleError(`getLogs failed`)),
        map(this.extractLogs)
   );
}

getLog(key: string, logId: number): Observable<logModel[]> {
 return this.http.get<logModel[]>(endpoint + key +'/logs/'+logId)
    .pipe(
        //tap(_ => console.log(`fetched timelog w/id=${logId}`)),
        catchError(this.handleError<any>(`getLog id=${logId}`)),
        map(this.extractLog)
)}
    
storeLog(key: string, log): Observable<any> {
   return this.http.post<any>(endpoint +key+'/add', JSON.stringify(log), httpOptions)
    .pipe(
        //tap((log) => console.log(`found log w/ id=${log.log['id']}`)),
        catchError(this.handleError<any>('storeLog')),
    )
}

storeLogitem(key:string, logId: number, logitem): Observable<any> {
      return this.http.post<any>(endpoint +key+'/logs/'+logId, JSON.stringify(logitem), httpOptions)
    .pipe(
        //tap((logitem) => console.log(`found logitem w/ id=${logitem.logitem['id']}`)),
        catchError(this.handleError<any>('storeLogitem'))
    );
}

updateLog(key:string, logid:number, timelog): Observable<any> {
  return this.http.put(endpoint + key+'/logs/' + logid, JSON.stringify(timelog), httpOptions).pipe(
    //tap(_ => console.log(`updated log id=${logid}`)),
    catchError(this.handleError<any>('updateLog'))
  );
}

  /*
deleteLog(id): Observable<logModel> {
  return this.http.delete<logModel>(endpoint + key+'/logs/' + id, httpOptions).pipe(
    tap(_ => console.log(`deleted log id=${id}`)),
    catchError(this.handleError<any>('deleteLog'))
  );
}    
*/

 private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    console.error(error);

    console.log(`${operation} failed: ${error.message}`);

    return of(result as T);
  };
}

}
