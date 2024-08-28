import { createAction, props } from '@ngrx/store';
import { CommonSearchResultModel } from '../../model/search.model';
import { HttpErrorResponseModel } from '../../model/http-error-response.model';
import {ProfileModel} from "../../model/profile.model";

export const search = createAction(
  '[Search] Search',
  props<{ query: string }>(),
);

export const searchSuccess = createAction(
  '[Search] Search Success',
  props<{ searchResult: CommonSearchResultModel }>(),
);

export const searchFailure = createAction(
  '[Search] Search Failure',
  props<{ searchResultPostFailure: HttpErrorResponseModel }>(),
);

export const searchByUsername = createAction(
  '[Search] Search by Username',
  props<{ username: string }>(),
);

export const searchByUsernameSuccess = createAction(
  '[Search] Search by Username Success',
  props<{ searchResult: CommonSearchResultModel }>(),
);

export const searchByUsernameFailure = createAction(
  '[Search] Search by Username Failure',
  props<{ error: HttpErrorResponseModel }>(),
);

export const searchUserPosts = createAction('[Search] Search User Posts', props<{ username: string }>());
export const searchUserPostsSuccess = createAction('[Search] Search User Posts Success', props<{ searchResult: CommonSearchResultModel }>());
export const searchUserPostsFailure = createAction('[Search] Search User Posts Failure', props<{ error: HttpErrorResponseModel }>());

