import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosLinkNavigationComponent } from './todos-link-navigation.component';


describe('TodosLinkNavigationComponent', () => {
  let component: TodosLinkNavigationComponent;
  let fixture: ComponentFixture<TodosLinkNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodosLinkNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosLinkNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
