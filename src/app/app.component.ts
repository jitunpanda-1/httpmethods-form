import { PostService } from './post.service';
import { Post } from './post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { stringify } from 'querystring';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts : Post[] = [];
  isFetching = false;
  error =null;
  private errorSub : Subscription;
  postForm : NgForm;


  constructor(private http: HttpClient, private postService: PostService) {}
  
  ngOnInit() {
    
    this.errorSub = this.postService.error.subscribe(errorMessage=>{
      this.error = errorMessage;
    });
    this.isFetching= true;
    this.postService.fetchPosts().subscribe(posts=>{
      this.isFetching= false;
      this.loadedPosts= posts;
    }, error=>{
      this.error = error.message;
    });
  }

  onCreatePost(postData: Post) {
    
    console.log(this.postForm);
      this.postService.createAndStorePosts(postData.title, postData.content);
  }
  
  onFetchPosts() {
    this.isFetching= true;
   this.postService.fetchPosts().subscribe(posts=>{
    this.isFetching= false;
    this.loadedPosts= posts;
  }, error=>{
    this.isFetching= false;
    this.error = error.message;
  });
}

  onClearPosts() {
    this.postService.deletePosts().subscribe(()=>{
      this.loadedPosts =[];
    });
  }
  
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
  onHandleError(){
    this.isFetching= false;
    this.error= null;
  }
  
}
