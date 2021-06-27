import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { render, screen } from '@testing-library/angular';
import { TodoCheckerComponent } from './todo-checker.component';

describe(
  'Vanilla Angular Testing / Mixed Mode' + TodoCheckerComponent.name,
  () => {
    let fixture: ComponentFixture<TodoCheckerComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TodoCheckerComponent],
      });

      fixture = TestBed.createComponent(TodoCheckerComponent);
      fixture.componentInstance.todo = { isDone: false, text: 'Buy milk' };
      fixture.detectChanges();
    });

    it('is marked as checked when the todo is done', () => {
      fixture.componentInstance.todo.isDone = true;
      fixture.detectChanges();

      const checkbox: HTMLInputElement = fixture.debugElement.query(
        By.css('input[type=checkbox]')
      ).nativeElement;

      expect(checkbox.checked).toBe(true);
    });
  }
);

describe(
  'Vanilla Angular Testing / Pure Template' + TodoCheckerComponent.name,
  () => {
    let fixture: ComponentFixture<TodoCheckerComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TodoCheckerComponent],
      });

      fixture = TestBed.createComponent(TodoCheckerComponent);
      fixture.componentInstance.todo = { isDone: false, text: 'Buy milk' };
      fixture.detectChanges();
    });

    it('is marked as checked when the todo is done', () => {
      const checkbox: () => HTMLInputElement = () =>
        fixture.debugElement.query(By.css('input[type=checkbox]'))
          .nativeElement;

      checkbox().click();

      checkbox().dispatchEvent(new Event('click'));

      fixture.detectChanges();

      expect(checkbox().checked).toBe(true);
    });
  }
);

describe('Testing Library ' + TodoCheckerComponent.name, () => {
  it('is marked as checked when the todo is done', async () => {
    await render(TodoCheckerComponent, {
      componentProperties: { todo: { isDone: false, text: 'Buy milk' } },
    });

    expect(screen.queryByRole('checkbox')).not.toBeChecked();

    screen.queryByRole('checkbox').click();

    expect(screen.queryByRole('checkbox')).toBeChecked();
  });
});

describe('Testing Library / Test Id' + TodoCheckerComponent.name, () => {
  it('is marked as checked when the todo is done', async () => {
    await render(TodoCheckerComponent, {
      componentProperties: { todo: { isDone: false, text: 'Buy milk' } },
    });

    expect(screen.queryByTestId('todo-checkbox')).not.toBeChecked();

    screen.queryByTestId('todo-checkbox').click();

    expect(screen.queryByTestId('todo-checkbox')).toBeChecked();
  });
});
