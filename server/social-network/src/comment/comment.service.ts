import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post/entities/post.entity';
import { Repository } from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private postService: PostService,
  ) {}

  // create comment
  async create(
    createCommentDto: CreateCommentDto,

  ) {
    const post = await this.postRepository.findOne({ where: { id: createCommentDto.postId } });
    const profile = await this.profileRepository.findOne({ where: { uid: createCommentDto.uid } });

    // If the post is empty, throw an error
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // If the uid is empty, throw an error
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (
      !createCommentDto.content
    ) {
      throw new ForbiddenException('Content cannot be empty');
    }

    // Create the comment in the postEntity and create comment entity
    const newComment = this.commentRepository.create({
      ...createCommentDto,
    });
    const savedComment = await this.commentRepository.save(newComment);

    //update post entity with comment

    return savedComment;
  }

  //get all comments by postId
  async findCommentByPostId(postId: number) {
    //parse postId to number
    console.log('postId: service', postId);
    postId = Number(postId);
    console.log('postId: service', postId);

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.commentRepository.find({ where: { postId } });
  }

  //get comment by commentId
  async findCommentById(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  //update comment
  async updateComment(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (
      !updateCommentDto.content
    ) {
      throw new ForbiddenException('Content cannot be empty');
    }
    return await this.commentRepository.save({
      ...comment,
      ...updateCommentDto,
    });
  }

  //delete comment
  async deleteComment(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    //delete comment from post entity
    return await this.commentRepository.remove(comment);
  }
}
