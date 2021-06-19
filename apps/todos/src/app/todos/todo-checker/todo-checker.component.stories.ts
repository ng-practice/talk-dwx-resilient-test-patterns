import { Meta, Story } from '@storybook/angular';
import { TodoCheckerComponent } from './todo-checker.component';

const meta: Meta = {
  title: 'TodoCheckerComponent',
  component: TodoCheckerComponent,
};
export default meta;

export const primary: Story<TodoCheckerComponent> = (args) => ({
  moduleMetadata: {
    imports: [],
  },
  props: {
    ...args,
  },
});
primary.args = {
  todo: { text: 'Wow', isDone: true },
};
