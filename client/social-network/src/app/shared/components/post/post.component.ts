import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { IdToAvatarPipe } from '../../pipes/id-to-avatar.pipe';
import { IdToNamePipe } from '../../pipes/id-to-name.pipe';
import { Store } from '@ngrx/store';
import { ProfileState } from '../../../ngrx/profile/profile.state';
import { ProfileModel } from '../../../model/profile.model';
import { Subscription } from 'rxjs';
import { PostModel } from '../../../model/post.model';
import { Router } from '@angular/router';
import * as ProfileActions from '../../../ngrx/profile/profile.actions';
import * as PostActions from '../../../ngrx/post/post.actions';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MaterialModule,
    NgForOf,
    NgIf,
    IdToAvatarPipe,
    AsyncPipe,
    IdToNamePipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  constructor(
    private route: Router,
    private store: Store<{
      profile: ProfileState;
    }>,
  ) {}

  profiles = <ProfileModel>{};

  @Input() post: PostModel = <PostModel>{};
  @Output() imageClick = new EventEmitter<void>();

  onImageClick() {
    this.imageClick.emit();
  }

  navigateToProfile() {
    this.route.navigateByUrl(`/profile/${this.post.uid}`).then();
    this.store.dispatch(PostActions.clearMinePost());
    this.store.dispatch(ProfileActions.getById({ uid: this.post.uid }));
  }
}
