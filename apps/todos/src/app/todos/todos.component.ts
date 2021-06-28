import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from '@todos/shared-interfaces';
import { Subscription } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { TodosService } from './shared/todos.service';
import { APP_TITLE } from './tokens';

@Component({
  selector: 'nde-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit, OnDestroy {
  private sink = new Subscription();

  todos: Todo[] = [];
  waitingMessage = '';

  @HostBinding('class') cssClass = 'todo__app';

  constructor(
    private todosService: TodosService,
    private route: ActivatedRoute,
    @Inject(APP_TITLE) public readonly appTitle: string
  ) {}

  ngOnInit(): void {
    this.sink.add(
      this.route.paramMap
        .pipe(
          switchMap((paramMap) =>
            this.todosService.query(paramMap.get('query'))
          )
        )
        .subscribe((todos) => (this.todos = todos))
    );
  }

  ngOnDestroy(): void {
    this.sink.unsubscribe();
  }

  get activeTodos() {
    return this.todos.filter((todo) => !todo.isDone).length;
  }

  addTodo(newTodo: Todo) {
    this.sink.add(
      this.todosService
        .create(newTodo)
        .pipe(
          switchMap(() => this.todosService.query()),
          /** tweaking for showing negative test assertion in cypress */
          delay(200),
          tap(() => (this.waitingMessage = 'The test did not see me coming')),
          delay(2000),
          tap(() => (this.waitingMessage = ''))
        )
        .subscribe((todos) => (this.todos = todos))
    );
  }

  completeOrIncompleteTodo(todoForUpdate: Todo) {
    this.sink.add(
      this.todosService
        .completeOrIncomplete(todoForUpdate)
        .pipe(switchMap(() => this.todosService.query()))
        .subscribe((todos) => (this.todos = todos))
    );
  }

  removeTodo(todoForRemoval: Todo) {
    this.sink.add(
      this.todosService
        .remove(todoForRemoval)
        .pipe(switchMap(() => this.todosService.query()))
        .subscribe((todos) => (this.todos = todos))
    );
  }
}
