import { HttpErrorResponseModel } from '../../model/http-error-response.model';
import { CommonSearchResultModel } from '../../model/search.model';
import {PostModel} from "../../model/post.model";

export interface SearchState {
  searchResult: CommonSearchResultModel;
  searchResultLoading: boolean;
  searchResultFailure: HttpErrorResponseModel;
  isSearching: boolean;
  isSearchingSuccess: boolean;

}
