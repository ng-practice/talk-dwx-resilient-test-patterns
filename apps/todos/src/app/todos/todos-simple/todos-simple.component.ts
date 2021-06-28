import { Component, OnInit } from '@angular/core';
import { Todo } from '@todos/shared-interfaces';

@Component({
  selector: 'todos',
  template: `
    <h1>Todos</h1>
    <nde-todo-quick-add (create)="addTodo($event)"></nde-todo-quick-add>
    <nde-todo-checker
      [todo]="todo"
      *ngFor="let todo of todos"
    ></nde-todo-checker>
  `,
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];

  ngOnInit(): void {
    this.todos = [{ text: 'initial', isDone: false }];
  }

  addTodo(todo: Todo) {
    this.todos = [...this.todos, todo];
  }
}
