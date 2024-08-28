import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { SearchService } from '../../service/search/search.service';
import * as searchActions from './search.actions';
import { ofType } from '@ngrx/effects';
import {mergeMap, of, switchMap} from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class searchEffects {
  search$ = createEffect(() => {
    return this.action$.pipe(
      ofType(searchActions.search),
      switchMap((action) => {
        return this.searchService.search(action.query).pipe(
          map((searchResult) => {
            console.log('searchResult', searchResult);
            return searchActions.searchSuccess({ searchResult });
          }),
          catchError((error) => {
            return of(
              searchActions.searchFailure({ searchResultPostFailure: error }),
            );
          }),
        );
      }),
    );

  },);
  searchByUsername$ = createEffect(() => {
   return this.action$.pipe(
     ofType(searchActions.searchByUsername),
     switchMap((action) => {
       return this.searchService.searchByUsername(action.username).pipe(
         map((searchResult) => {
           console.log('searchResult', searchResult);
           return searchActions.searchByUsernameSuccess({ searchResult });
         }),
         catchError((error) => {
           return of(
             searchActions.searchByUsernameFailure({ error }),
           );
         }),
       );
     }),
   );
  },);
  searchUserPosts$ = createEffect(() =>
    this.action$.pipe(
      ofType(searchActions.searchUserPosts),
      mergeMap((action) =>
        this.searchService.searchUserPosts(action.username).pipe(
          map((searchResult) =>
            searchActions.searchUserPostsSuccess({ searchResult })
          ),
          catchError((error) =>
            of(searchActions.searchUserPostsFailure({ error }))
          )
        )
      )
    )
  );


  constructor(
    private action$: Actions,
    private searchService: SearchService,
  ) {}
}
