import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import {useActiveDocContext} from "@docusaurus/plugin-content-docs/client";
import styles from "./styles.module.css";

export type NextCardItem = {
  title: string;
  description: string;
  /** Doc path after the version prefix, without a leading slash. */
  path: string;
};

function toHref(versionPath: string, docPath: string): string {
  const base = versionPath.endsWith("/")
    ? versionPath.slice(0, -1)
    : versionPath;
  return `${base}/${docPath}`;
}

export default function NextCards({
  items,
}: {
  items: NextCardItem[];
}): JSX.Element {
  const {activeVersion} = useActiveDocContext("default");
  const versionPath = activeVersion?.path ?? "";

  return (
    <div className="row">
      {items.map((item) => (
        <div className="col col--4 margin-bottom--lg" key={item.path}>
          <Link
            className={clsx("card padding--lg", styles.card)}
            to={toHref(versionPath, item.path)}
          >
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
