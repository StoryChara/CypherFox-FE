// src/components/cards/LabEditor.jsx
import Editor from "@monaco-editor/react";

export default function LabEditor({
    initialCode,
    language = "python",
    onChange,
    height = "360px",
}) {
    const handleChange = (value) => {
        onChange?.(value ?? "");
    };

    const handleMount = (editor, monaco) => {
        // Definir tema personalizado basado en la paleta CypherFox
        monaco.editor.defineTheme("cypherfox-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
                // Texto por defecto
                { token: "", foreground: "F9F4F4", background: "06040E" },

                // Palabras clave (def, return, if, etc.)
                { token: "keyword", foreground: "cb4b16", fontStyle: "bold" },

                // Nombres de funciones
                { token: "identifier", foreground: "b58900" },

                // Strings
                { token: "string", foreground: "468966" },

                // Comentarios
                { token: "comment", foreground: "586e75", fontStyle: "italic" },

                // Números
                { token: "number", foreground: "b89859" },
            ],
            colors: {
                // Fondo general del editor
                "editor.background": "#06040E",
                "editor.foreground": "#F9F4F4",

                // Línea actual
                "editor.lineHighlightBackground": "#0F0B1F",
                "editorLineNumber.foreground": "#5A4E80",
                "editorLineNumber.activeForeground": "#F9F4F4",

                // Cursor
                "editorCursor.foreground": "#E78F41",

                // Selección
                "editor.selectionBackground": "#13824555",
                "editor.inactiveSelectionBackground": "#13824533",

                // Borde del editor
                "editor.focusedStackFrameHighlightBorder": "#E78F41",
                "editorWidget.border": "#E78F4188",

                // Minimap (aunque está desactivado)
                "minimap.background": "#06040E",
            },
        });

        monaco.editor.setTheme("cypherfox-dark");
    };

    return (
        <div className="cf-lab-monaco-wrapper">
            <Editor
                height={height}
                defaultLanguage={language}
                defaultValue={initialCode}
                theme="cypherfox-dark"
                options={{
                    fontFamily: "Menlo, Monaco, 'Courier New', monospace",
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    cursorBlinking: "smooth",
                }}
                onChange={handleChange}
                onMount={handleMount}
            />
        </div>
    );
}