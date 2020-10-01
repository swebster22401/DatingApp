import { map, min } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';

// const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer ' + localStorage.getItem('token')
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // getUsers() : Observable<User[]> {
  //   const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
  getUsers(page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
      const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null)
    {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if(userParams != null)
    {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if(likesParam == 'Likers'){
      params = params.append('likers', 'true');
    }

    if(likesParam == 'Likers'){
      params = params.append('likees', 'true');
    }


    return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null){
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult; 
        })
      );
  }
  // getUsers(): Observable<User[]>{
  //   // return this.http.get<User[]>(this.baseUrl + 'users', httpOptions);
  //   return this.http.get<User[]>(this.baseUrl + 'users');
  // }

  getUser(id): Observable<User>{
    // return this.http.get<User>(this.baseUrl + 'users/' + id, httpOptions);
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }
  
  updateUser(id: number, user: User){
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  //http://localhost:5000/api/users/2/photos/11/setMain
  setMainPhoto(userId: number, id: number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain',{});
  }

  deletePhoto(userId: number, id: number){
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number){
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }
}
