import { Injectable } from '@angular/core';
import { HttpClientAuth } from '../../util/http-client-auth';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private httpClient: HttpClientAuth) {}

  search(q: string) {
    return this.httpClient.get(`search/any?q=${q}`);
  }

  searchPosts(query: string) {
    return this.httpClient.get(`search/posts?q=${query}`);
  }

  searchByUsername(username: string) {
    return this.httpClient.get(`search/userName?q=${username}`);
  }

  //searchUserPosts
  searchUserPosts(username: string) {
    return this.httpClient.get(`search/userPosts?q=${username}`);
  }

}
