<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { sql, PostgreSQL } from '@codemirror/lang-sql';
  import { Compartment } from '@codemirror/state';

  interface Props {
    value?: string;
    onchange?: (newValue: string) => void;
    disabled?: boolean;
  }

  let { value = $bindable(''), onchange, disabled = false }: Props = $props();

  let container: HTMLDivElement | undefined = $state();
  let view: EditorView | undefined;

  // Compartment that owns the editable facet so we can reconfigure it at runtime
  const editableConf = new Compartment();

  onMount(() => {
    view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        sql({ dialect: PostgreSQL }),
        editableConf.of(EditorView.editable.of(!disabled)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            value = newValue;
            onchange?.(newValue);
          }
        }),
        EditorView.theme({
          '&': { height: '100%', minHeight: '120px' },
          '.cm-scroller': { fontFamily: 'ui-monospace, monospace', fontSize: '14px' },
        }),
      ],
      parent: container!,
    });

    return () => {
      view?.destroy();
      view = undefined;
    };
  });

  // Sync external value changes into CodeMirror (e.g. starter SQL or reset).
  // The incoming !== current check is the loop guard: after a local edit the doc
  // already equals `value`, so this effect re-runs but dispatches nothing.
  $effect(() => {
    const incoming = value;
    if (!view) return;
    const current = view.state.doc.toString();
    if (incoming !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: incoming },
      });
    }
  });

  // Reflect disabled state via CodeMirror's built-in editable facet
  $effect(() => {
    if (!view) return;
    view.dispatch({
      effects: editableConf.reconfigure(EditorView.editable.of(!disabled)),
    });
  });
</script>

<div bind:this={container} class="editor-container" class:disabled></div>

<style>
  .editor-container {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
    min-height: 120px;
  }

  .editor-container.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  :global(.editor-container .cm-editor) {
    height: 100%;
  }

  :global(.editor-container .cm-editor.cm-focused) {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }
</style>
