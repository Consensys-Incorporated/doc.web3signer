import React, { useEffect, useRef } from "react";
import CopyPageButton from "docusaurus-plugin-copy-page-button/src/CopyPageButton";
import styles from "docusaurus-plugin-copy-page-button/src/styles.module.css";

// The built site publishes one Markdown file per operation at the page URL
// plus ".md". Copy and View read that file. Other menu actions are unchanged.

function markdownUrl() {
  const path = window.location.pathname.replace(/\/$/, "") || "/index";
  return `${path}.md`;
}

export default function ApiCopyPageButton() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return undefined;
    }

    const onClick = (event) => {
      const button = event.target.closest("button");
      if (!button || button.getAttribute("aria-haspopup") === "true") {
        return;
      }
      const title = button.querySelector(`.${styles.itemTitle}`)?.textContent;
      if (title !== "Copy page" && title !== "View as Markdown") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const url = markdownUrl();
      if (title === "View as Markdown") {
        window.open(url, "_blank", "noopener");
      } else {
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(String(response.status));
            }
            return response.text();
          })
          .then((text) => navigator.clipboard.writeText(text))
          .catch(() => {});
      }
      root.querySelector("button[aria-haspopup='true']")?.click();
    };

    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div ref={ref}>
      <CopyPageButton />
    </div>
  );
}
