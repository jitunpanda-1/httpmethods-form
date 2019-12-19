import { map, catchError, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';

@Injectable({providedIn : 'root'})
export class PostService{
    error = new Subject<string>();

    constructor(private http: HttpClient){

    }

   createAndStorePosts(title: string, content: string){
        // Send Http request
    const postData : Post = {title: title, content: content};

    this.http.post<{name: string}>('https://my-http-prj.firebaseio.com//posts.json',postData, 
    {
        observe:'response'

    })
    /* .pipe(map(responseData=>{
      const postArray =[];
      for(const key in responseData){
        if(responseData.hasOwnProperty(key)){
          postArray.push({...responseData[key], id:key});
        }
      }
      return postArray;
    })) */
      .subscribe(responseData => {
        // console.log(responseData);
        console.log(responseData.body);
      }, error=>{this.error.next(error.message)});
   } 

   /* fetchPosts(){
    return this.http.get<{[key:string]: Post}>('https://my-http-prj.firebaseio.com//posts.json').pipe(
        map(responseData =>{
          // map((responseData: {[key:string]: Post})  
          // instead of this we can use this.http.get<{[key:string]: Post} angular will handle this
  
        const postArray : Post[]=[];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({...responseData[key], id:key});
          }
        }
        return postArray;
      }),catchError(errorRes =>{
         return  throwError(errorRes);
      }))
   } */

//    with Header in the get method
   fetchPosts(){
    // let searchParams = new HttpParams();
    // searchParams = searchParams.append('print','pretty');
    // searchParams = searchParams.append('custom ','key');
    return this.http.get<{[key:string]: Post}>('https://my-http-prj.firebaseio.com//posts.json', {
        headers: new HttpHeaders({'Custom-Header': 'hello'}),
        params: new HttpParams().set('print','pretty')// to add single query params
        // params: searchParams// for multiple query params
    } ).pipe(
        map(responseData =>{
          // map((responseData: {[key:string]: Post})  
          // instead of this we can use this.http.get<{[key:string]: Post} angular will handle this
  
        const postArray : Post[]=[];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({...responseData[key], id:key});
          }
        }
        return postArray;
      }),catchError(errorRes =>{
         return  throwError(errorRes);
      }))
   }

   deletePosts(){
       return this.http.delete('https://my-http-prj.firebaseio.com//posts.json',
       {
           observe:'events'
       }).pipe(tap(event=>{
            console.log(event);
            if(event.type === HttpEventType.Sent){
                //...
            }
            if(event.type === HttpEventType.Response){
                console.log(event.body);
            }
       }));
   }
}