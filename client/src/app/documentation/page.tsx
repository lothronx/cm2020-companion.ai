import React from "react";
import { marked } from "marked";
import fs from "fs";

/**
 * Documentation
 */

export default async function Documentation() {
  const filePath = "./public/README.md";
  const fileContent = await fs.readFileSync(filePath, "utf8");
  const parsedContent = await marked.parse(fileContent);
  const { html } = { html: parsedContent };

  return (
    <div>
      <iframe srcDoc={html}></iframe>
    </div>
  );
}
