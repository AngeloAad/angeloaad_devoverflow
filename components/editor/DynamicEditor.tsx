"use client";

import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { forwardRef } from "react";

// Dynamically import the Editor
const EditorComponent = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface DynamicEditorProps {
  value: string;
  fieldChange: (value: string) => void;
}

// Forward the ref through the dynamic component
const DynamicEditor = forwardRef<MDXEditorMethods, DynamicEditorProps>(
  (props, ref) => {
    return <EditorComponent {...props} ref={ref} />;
  }
);

DynamicEditor.displayName = "DynamicEditor";

export default DynamicEditor;
