import { type TaskFieldCode } from '@/modules/tasks';
import { CheckboxModel, MyCheckboxWithModel } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import styled from 'styled-components';
import { BuilderStepCheckboxItemWrapper, useGetTasksFieldsOptions } from '../../../../shared';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding-left: 24px;
`;

interface Props {
  activeFields: TaskFieldCode[];
  onChange: (activeFields: TaskFieldCode[]) => void;
}

const TaskFieldsSelector = observer((props: Props) => {
  const { activeFields, onChange } = props;

  const model = useLocalObservable<CheckboxModel>(() => CheckboxModel.create(activeFields));

  const taskFieldsOptions = useGetTasksFieldsOptions();

  return (
    <Root>
      {taskFieldsOptions.map(tf => (
        <BuilderStepCheckboxItemWrapper key={tf.value}>
          <MyCheckboxWithModel model={model} value={tf.value} handleChange={onChange} />
          {tf.label}
        </BuilderStepCheckboxItemWrapper>
      ))}
    </Root>
  );
});

export { TaskFieldsSelector };
