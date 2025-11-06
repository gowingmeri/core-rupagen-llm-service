// @/components/CodeBlock.tsx
import { useState } from "react";

interface CodeBlockProps {
  content: string;
}

interface FormattedTextProps {
  text: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const parts = content.split(/(```[\s\S]*?```)/g);

  const handleCopyCode = (code: string, index: number): void => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const highlightCode = (code: string, language: string): string => {
    // Basic syntax highlighting patterns
    const patterns = {
      // Keywords
      keywords:
        /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|public|private|protected|static|readonly)\b/g,
      // Strings
      strings: /(["'`])(?:(?!\1)[^\\]|\\.)*/g,
      // Comments
      comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
      // Numbers
      numbers: /\b\d+(\.\d+)?\b/g,
      // Functions
      functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    };

    let highlightedCode = code;

    // Apply highlighting
    highlightedCode = highlightedCode.replace(
      patterns.comments,
      '<span style="color: #6A9955;">$1</span>',
    );
    highlightedCode = highlightedCode.replace(
      patterns.strings,
      '<span style="color: #CE9178;">$1</span>',
    );
    highlightedCode = highlightedCode.replace(
      patterns.keywords,
      '<span style="color: #569CD6;">$1</span>',
    );
    highlightedCode = highlightedCode.replace(
      patterns.numbers,
      '<span style="color: #B5CEA8;">$1</span>',
    );
    highlightedCode = highlightedCode.replace(
      patterns.functions,
      '<span style="color: #DCDCAA;">$1</span>',
    );

    return highlightedCode;
  };

  return (
    <div className="w-[256px] text-xs overflow-x-auto">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const languageMatch = part.match(/```(\w+)?/);
          const language = languageMatch ? languageMatch[1] : "plaintext";
          const code = part.replace(/```[a-z]*\n?/i, "").replace(/```$/, "");

          return (
            <div
              key={index}
              className="relative border border-black/15 text-black rounded-xl mb-5 p-4 bg-white overflow-x-auto"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-black/50 uppercase">
                  {language}
                </span>
                <button
                  onClick={() => handleCopyCode(code, index)}
                  className="border border-black/15 text-black text-[10px] px-2 py-1 rounded hover:bg-gray-600 transition"
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </div>

              <pre className="text-[0.75rem] text-black overflow-x-auto">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(code, language),
                  }}
                />
              </pre>
            </div>
          );
        }

        return <FormattedText key={index} text={part} />;
      })}
    </div>
  );
};

const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  return (
    <div className="-z-10 w-full text-xs">
      {text.split("\n").map((line, index) => {
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        line = line.replace(/\*(.*?)\*/g, "<em>$1</em>");
        line = line.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>',
        );

        if (/^\s*-\s/.test(line)) {
          return (
            <ul key={index} className="list-disc ml-5">
              <li dangerouslySetInnerHTML={{ __html: line.substring(2) }}></li>
            </ul>
          );
        }

        return (
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: line }}
            className="mb-2"
          ></p>
        );
      })}
    </div>
  );
};

export default CodeBlock;
