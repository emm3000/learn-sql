<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { keymap } from '@codemirror/view';
  import { sql, PostgreSQL } from '@codemirror/lang-sql';
  import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
  import { Compartment, Prec } from '@codemirror/state';
  import { tags } from '@lezer/highlight';

  interface Props {
    value?: string;
    onchange?: (newValue: string) => void;
    disabled?: boolean;
    onRun?: () => void;
  }

  let { value = $bindable(''), onchange, disabled = false, onRun }: Props = $props();

  let container: HTMLDivElement | undefined = $state();
  let view: EditorView | undefined;

  // Compartment that owns the editable facet so we can reconfigure it at runtime
  const editableConf = new Compartment();

  // Dark syntax highlighting mapped to --sx-* design tokens.
  // CSS custom properties work as plain string values here since the
  // theme is injected into the document, where the :root vars resolve.
  const pgDarkHighlight = HighlightStyle.define([
    { tag: tags.keyword, color: 'var(--sx-keyword)', fontWeight: '600' },
    { tag: tags.string, color: 'var(--sx-string)' },
    { tag: tags.number, color: 'var(--sx-number)' },
    { tag: tags.comment, color: 'var(--sx-comment)', fontStyle: 'italic' },
    { tag: tags.punctuation, color: 'var(--sx-punct)' },
    { tag: tags.operator, color: 'var(--sx-punct)' },
    { tag: tags.name, color: 'var(--sx-ident)' },
    { tag: tags.variableName, color: 'var(--sx-ident)' },
    { tag: tags.typeName, color: 'var(--sx-ident)' },
    { tag: tags.special(tags.string), color: 'var(--sx-string)' },
  ]);

  onMount(() => {
    view = new EditorView({
      doc: value,
      extensions: [
        // Mod-Enter runs the query. Prec.highest so it shadows basicSetup's
        // default Mod-Enter binding (if any) rather than the reverse.
        Prec.highest(
          keymap.of([
            {
              key: 'Mod-Enter',
              run: () => {
                onRun?.();
                return true;
              },
            },
          ])
        ),
        basicSetup,
        sql({ dialect: PostgreSQL }),
        editableConf.of(EditorView.editable.of(!disabled)),
        EditorView.contentAttributes.of({ 'aria-label': 'SQL editor' }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            value = newValue;
            onchange?.(newValue);
          }
        }),
        // Dark editor theme — { dark: true } tells CodeMirror to mark this as a
        // dark theme so plugins that check can adapt accordingly.
        EditorView.theme(
          {
            '&': {
              height: '100%',
              minHeight: '140px',
              background: 'var(--ed-bg)',
              color: 'var(--ed-ink)',
            },
            '.cm-content': {
              caretColor: 'var(--beginner)',
              fontFamily: 'var(--f-mono)',
              fontSize: '13.5px',
              lineHeight: '22px',
              padding: '15px 0',
            },
            '.cm-cursor': {
              borderLeftColor: 'var(--beginner)',
            },
            '.cm-scroller': {
              fontFamily: 'var(--f-mono)',
              fontSize: '13.5px',
              lineHeight: '22px',
            },
            '.cm-gutters': {
              background: 'var(--ed-surface)',
              color: 'var(--ed-ink-3)',
              borderRight: '1px solid var(--ed-line)',
            },
            '.cm-activeLine': {
              background: 'rgba(255,255,255,.03)',
            },
            '.cm-activeLineGutter': {
              background: 'rgba(255,255,255,.03)',
            },
            '.cm-selectionBackground': {
              background: 'rgba(120,140,200,.28)',
            },
            '&.cm-focused .cm-selectionBackground': {
              background: 'rgba(120,140,200,.28)',
            },
            '.cm-content ::selection': {
              background: 'rgba(120,140,200,.28)',
            },
            '&.cm-focused': {
              outline: '2px solid var(--ed-line-2)',
              outlineOffset: '-2px',
            },
          },
          { dark: true }
        ),
        syntaxHighlighting(pgDarkHighlight),
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

<div bind:this={container} class="editor-container" class:disabled aria-label="SQL editor"></div>

<style>
  .editor-container {
    border: none;
    overflow: hidden;
    background: var(--ed-bg);
    min-height: 140px;
  }

  .editor-container.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  :global(.editor-container .cm-editor) {
    height: 100%;
  }
</style>
