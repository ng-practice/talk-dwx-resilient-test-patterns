import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '@todos/shared-interfaces';
import { Observable } from 'rxjs';

const todosUrl = '/api';

@Injectable({ providedIn: 'root' })
export class TodosService {
  constructor(private http: HttpClient) {}

  query(param?: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${todosUrl}?query=${param ? param : 'all'}`);
  }

  create(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(todosUrl, todo);
  }

  remove(todoForRemoval: Todo): Observable<Todo> {
    return this.http.delete<Todo>(`${todosUrl}/${todoForRemoval.id}`);
  }

  completeOrIncomplete(todoForUpdate: Todo): Observable<Todo> {
    const updatedTodo = this.toggleTodoState(todoForUpdate);
    return this.http.put<Todo>(`${todosUrl}/${todoForUpdate.id}`, updatedTodo);
  }

  private toggleTodoState(todoForUpdate: Todo): any {
    return {
      ...todoForUpdate,
      isDone: todoForUpdate.isDone ? false : true,
    };
  }
}
