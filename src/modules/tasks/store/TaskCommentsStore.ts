import { watchdogStore } from '@/app';
import type { DataStore } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  taskApi,
  type CreateTaskCommentDto,
  type TaskCommentsMeta,
  type UpdateTaskCommentDto,
} from '../api';
import type { TaskComment } from '../shared';

export class TaskCommentsStore implements DataStore {
  private _taskId: number;

  comments: TaskComment[] = [];
  meta: TaskCommentsMeta = {
    total: 0,
  };

  isLoading = false;
  isLoadingMore = false;

  constructor(taskId: number) {
    this._taskId = taskId;

    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    await this.loadMoreComments();
  };

  loadComments = async (): Promise<void> => {
    try {
      this.isLoading = true;

      const { comments, meta } = await taskApi.getComments({ taskId: this._taskId });

      this.comments = comments;
      this.meta = meta;
    } catch (e) {
      throw new Error(`Error while loading comments for task with id ${this._taskId}: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  loadMoreComments = async (): Promise<void> => {
    if (this.comments.length < this.meta.total && !this.isLoadingMore) {
      try {
        this.isLoadingMore = true;

        const { comments, meta } = await taskApi.getComments({
          taskId: this._taskId,
          offset: this.comments.length,
        });

        this.comments = [...this.comments, ...comments];
        this.meta = meta;
      } catch (e) {
        throw new Error(`Error while loading comments for task with id ${this._taskId}: ${e}`);
      } finally {
        this.isLoadingMore = false;
      }
    }
  };

  addComment = async (dto: CreateTaskCommentDto): Promise<void> => {
    const comment = await taskApi.addComment({ taskId: this._taskId, dto });

    this.comments.unshift(comment);
  };

  updateComment = async (commentId: number, dto: UpdateTaskCommentDto): Promise<void> => {
    const comment = await taskApi.updateComment({ taskId: this._taskId, commentId, dto });

    const commentIdx = this.comments.findIndex(c => c.id === commentId);
    this.comments.splice(commentIdx, 1, comment);
  };

  deleteComment = async (commentId: number): Promise<void> => {
    await taskApi.deleteComment({ taskId: this._taskId, commentId });

    this.comments = this.comments.filter(c => c.id !== commentId);
  };

  likeComment = async (commentId: number): Promise<void> => {
    await taskApi.likeComment({ taskId: this._taskId, commentId });
  };

  unlikeComment = async (commentId: number): Promise<void> => {
    await taskApi.unlikeComment({ taskId: this._taskId, commentId });
  };

  reset = (): void => {
    this.comments = [];
  };
}
