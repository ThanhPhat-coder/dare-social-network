import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as commentActions from "./comment.actions";
import {of, switchMap} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpErrorResponseModel} from "../../model/http-error-response.model";
import {CommentService} from "../../service/comment/comment.service";

@Injectable()
export class CommentEffects {
  createComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(commentActions.createComment),
      switchMap((action) => {
        return this.commentService.createComment(action.content, action.postId, action.uid).pipe(
          map(() => {
            return commentActions.createCommentSuccess();
          }),
          catchError((error: HttpErrorResponseModel) => {
            return of(
              commentActions.createCommentFailure({ createCommentErrorMessage: error }),
            );
          }),
        );
      }),
    );
  });

  getComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(commentActions.GetComments),
      switchMap((action) => {
        return this.commentService.getComments(action.postId).pipe(
          map((comments) => {
            return commentActions.getCommentsSuccess({ comments });
          }),
          catchError((error: HttpErrorResponseModel) => {
            return of(
              commentActions.getCommentsFailure({ getCommentsErrorMessage: error }),
            );
          }),
        );
      }),
    );
  });



  constructor(private actions$: Actions, private commentService: CommentService) {
  }
}
