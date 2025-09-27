import { type EditorOptions } from '@tiptap/core';
import { Editor } from '@tiptap/react';
import { useEffect, useState, type DependencyList } from 'react';

const useForceUpdate = () => {
  const [, setValue] = useState(0);

  return () => setValue(value => value + 1);
};

export const useEditorOptimized = (
  options: Partial<EditorOptions> = {},
  deps: DependencyList = []
) => {
  const [editor, setEditor] = useState<Editor>(() => new Editor(options));
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    let instance: Editor;

    if (editor.isDestroyed) {
      instance = new Editor(options);

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setEditor(instance);
    } else {
      instance = editor;
    }

    instance.on('transaction', () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          forceUpdate();
        });
      });
    });

    return () => {
      instance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return editor;
};
