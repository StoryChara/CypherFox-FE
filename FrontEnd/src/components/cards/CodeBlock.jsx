// src/components/card/CodeBlock.jsx
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { pojoaque } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./CodeBlock.css";

export function CodeBlock({
    code,
    language = "python",
    showLineNumbers = true,
    className = "",
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Error copiando al portapapeles", err);
        }
    };

    return (
        <div className={`cf-codeblock-wrapper ${className}`}>
            <button
                type="button"
                className="cf-codeblock-copy-btn"
                onClick={handleCopy}
            >
                {copied ? "Copiado" : "Copiar"}
            </button>

            <SyntaxHighlighter
                language={language}
                style={pojoaque}
                className="cf-codeblock"
                showLineNumbers={showLineNumbers}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

export function ExampleBlock({
    fnName,
    params,
    result,
    paramMeta, // opcional: [["k","int"],["texto","str"]] para usar nombres
    language = "python",
}) {
    // Construir argumentos con nombres si tenemos meta: k=14, texto="CAESAR"
    let args;
    if (Array.isArray(paramMeta) && paramMeta.length === params.length) {
        args = params
            .map((value, idx) => {
                const [nombre] = paramMeta[idx];
                const valString =
                    typeof value === "string" ? `"${value}"` : String(value);
                return `${nombre}=${valString}`;
            })
            .join(", ");
    } else {
        // Fallback simple sin nombres
        args = params
            .map(v => (typeof v === "string" ? `"${v}"` : String(v)))
            .join(", ");
    }
    const codeLine = `print(${fnName}(${args}))`;
    return (
        <div className="cf-exampleblock">
            <CodeBlock
                code={codeLine}
                language={language}
                showLineNumbers={false}
            />
            <div className="cf-exampleblock-output">
                <span className="cf-exampleblock-output-arrow">»</span>
                <span className="cf-exampleblock-output-text">{result}</span>
            </div>
        </div>
    );
}