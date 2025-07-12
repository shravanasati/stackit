"use client";

import "@mdxeditor/editor/style.css";
import "./MdEditor.css";
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  headingsPlugin,
  quotePlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  type MDXEditorMethods,
  type MDXEditorProps,
  markdownShortcutPlugin,
  linkDialogPlugin,
  CreateLink,
} from "@mdxeditor/editor";

// @ts-expect-error it works without import
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// @ts-expect-error it works without import
import { $getSelection, $isRangeSelection, FORMAT_ELEMENT_COMMAND } from 'lexical';

import { useCallback, useEffect } from 'react';
import type { ForwardedRef } from "react";

// Custom Text Alignment Toolbar Component
const TextAlignmentToolbar = () => {
  const [editor] = useLexicalComposerContext();

  const alignText = useCallback(
    (alignment: 'left' | 'center' | 'right' | 'justify') => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
        }
      });
    },
    [editor]
  );

  return (
    <div className="mdxeditor-toolbar-item" style={{ display: 'flex', gap: '4px' }}>
      <button
        type="button"
        onClick={() => alignText('left')}
        className="mdxeditor-toolbar-button"
        title="Align Left"
        style={{ 
          minWidth: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="15" y2="12"/>
          <line x1="3" y1="18" x2="18" y2="18"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => alignText('center')}
        className="mdxeditor-toolbar-button"
        title="Align Center"
        style={{ 
          minWidth: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="6" y1="12" x2="18" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => alignText('right')}
        className="mdxeditor-toolbar-button"
        title="Align Right"
        style={{ 
          minWidth: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="9" y1="12" x2="21" y2="12"/>
          <line x1="6" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => alignText('justify')}
        className="mdxeditor-toolbar-button"
        title="Justify"
        style={{ 
          minWidth: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
  );
};

function MdEditor({
  editorRef,
  ...props
}: MDXEditorProps & { editorRef?: ForwardedRef<MDXEditorMethods> }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .markdown-editor ul {
        list-style-type: disc !important;
        padding-left: 20px !important;
        margin-left: 0 !important;
      }
      
      .markdown-editor ol {
        list-style-type: decimal !important;
        padding-left: 20px !important;
        margin-left: 0 !important;
      }
      
      .markdown-editor li {
        list-style: inherit !important;
        display: list-item !important;
        margin-left: 0 !important;
      }
      
      .markdown-editor ul li {
        list-style-type: disc !important;
      }
      
      .markdown-editor ol li {
        list-style-type: decimal !important;
      }
      
      .markdown-editor ul ul {
        list-style-type: circle !important;
      }
      
      .markdown-editor ul ul ul {
        list-style-type: square !important;
      }
      
      .markdown-editor ol ol {
        list-style-type: lower-alpha !important;
      }
      
      .markdown-editor ol ol ol {
        list-style-type: lower-roman !important;
      }
      
      .markdown-editor [style*="text-align"] {
        display: block !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <CreateLink />
              <TextAlignmentToolbar />
            </>
          ),
        }),
        headingsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        listsPlugin(),
        markdownShortcutPlugin(),
      ]}
      {...props}
      ref={editorRef}
      contentEditableClassName="prose"
      className="markdown-editor"
    />
  );
}

export default MdEditor;