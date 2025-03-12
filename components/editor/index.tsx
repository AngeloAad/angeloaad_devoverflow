// if you want to use a responsive mdxEditor that supports dark themes
// use this file
"use client";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  toolbarPlugin,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import { forwardRef } from "react";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

interface Props {
  value: string;
  fieldChange: (value: string) => void;
}

const Editor = forwardRef<MDXEditorMethods, Props>(
  ({ value, fieldChange, ...props }, ref) => {
    const { resolvedTheme } = useTheme();

    const theme = resolvedTheme === "dark" ? [basicDark] : [];

    return (
      <MDXEditor
        key={resolvedTheme}
        markdown={value}
        ref={ref}
        className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border-2"
        onChange={fieldChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          imagePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              css: "css",
              txt: "txt",
              sql: "sql",
              html: "html",
              saas: "saas",
              scss: "scss",
              bash: "bash",
              json: "json",
              js: "javascript",
              ts: "typescript",
              "": "unspecified",
              tsx: "TypeScript (React)",
              jsx: "JavaScript (React)",
            },
            autoLoadLanguageSupport: true,
            codeMirrorExtensions: theme,
          }),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
          toolbarPlugin({
            toolbarContents: () => (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <div className="flex flex-wrap">
                        <div className="flex items-center gap-1">
                          <UndoRedo />
                          <Separator />
                        </div>

                        <div className="flex items-center gap-1">
                          <BoldItalicUnderlineToggles />
                          <Separator />
                        </div>

                        <div className="flex items-center gap-1">
                          <ListsToggle />
                          <Separator />
                        </div>

                        <div className="flex items-center gap-1">
                          <CreateLink />
                          <InsertImage />
                          <Separator />
                        </div>

                        <div className="flex items-center gap-1">
                          <InsertTable />
                          <InsertThematicBreak />
                          <InsertCodeBlock />
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            ),
          }),
        ]}
        {...props}
      />
    );
  }
);

Editor.displayName = "Editor";

export default Editor;
