import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {filter, Subscription, take} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchService } from '../../../service/search/search.service';
import { PostModel } from '../../../model/post.model';
import { Store } from '@ngrx/store';
import * as SearchActions from '../../../ngrx/search/search.actions';
import * as postActions from '../../../ngrx/post/post.actions';
import { SearchState } from '../../../ngrx/search/search.state';
import { PostState } from '../../../ngrx/post/post.state';
import { ProfileState } from '../../../ngrx/profile/profile.state';
import { Router, RouterLink } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { ShareModule } from '../../../shared/share.module';
import { PostComponent } from '../../../shared/components/post/post.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    PostComponent,
    MaterialModule,
    AsyncPipe,
    NgForOf,
    NgIf,
    RouterLink,
    ShareModule,
    InfiniteScrollDirective,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  items: PostModel[] = [];
  posts: PostModel[] = [];
  searchControl = new FormControl();
  subscription: Subscription[] = [];
  isLoading = true;
  isSearching$ = this.store.select('search', 'isSearching');

  constructor(
    private router: Router,
    private store: Store<{
      search: SearchState;
      post: PostState;
      profile: ProfileState;
    }>,
    private searchService: SearchService,
  ) {}

  ngOnInit(): void {
    this.subscription.push(
      this.searchControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe((query) => {
          this.searchQuery = query.trim();
          this.performSearch();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(postActions.clearGetPost());
  }

  performSearch(): void {
    if (!this.searchQuery.trim()) {
      this.clearPosts();
      return;
    }

    this.isLoading = true;

    if (this.searchQuery.startsWith('@')) {
      this.searchByUsername();
    } else {
      this.searchByQuery();
    }
  }

  private searchByUsername(): void {
    const username = this.searchQuery.substring(1).trim();
    this.store.dispatch(SearchActions.searchByUsername({ username }));
    this.store.dispatch(SearchActions.searchUserPosts({ username }));
    this.handleSearchResults();
  }

  private searchByQuery(): void {
    const query = this.searchQuery.trim();
    this.store.dispatch(SearchActions.search({ query }));
    this.handleSearchResults();
  }


  private handleSearchResults(): void {
    this.store.select('search').pipe(
      filter((state: SearchState) => !state.isSearching),
      take(1)
    ).subscribe(searchState => {
      this.isLoading = false;
      this.items = [];

      if (searchState.isSearchingSuccess) {
        this.posts = searchState.searchResult.posts || [];
        this.items = this.items.concat(this.posts);
      } else {
        this.clearPosts();
      }

    });
  }

  private clearPosts(): void {
    this.posts = [];
    this.isLoading = false;
  }




}
