import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Heading from '@theme/Heading'

type CardItem = {
  title: string;
  link: string;
  description: React.JSX.Element;
  buttonName: string;
  buttonType:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "link";
};

const CardList: CardItem[] = [
  {
    title: "💭 Use Signing Keys",
    link: "/HowTo/Use-Signing-Keys",
    description: (
      <>
        Check out the various ways you can use signing keys such as raw files,
        keystores, vaults or via a HSM (Hardware Security Modules).
      </>
    ),
    buttonName: "Use signing keys",
    buttonType: "secondary",
  },
  {
    title: "👨‍💻 Reference",
    link: "/Reference/CLI/CLI-Subcommands",
    description: (
      <>
        Find command line arguments, API methods through JSON-RPC, and general
        configuration in the References section.
      </>
    ),
    buttonName: "Go to reference",
    buttonType: "info",
  },
];

function Card({ title, link, description, buttonName, buttonType }: CardItem) {
  return (
    <div className={clsx("col", "col--4", "margin-top--md")}>
      <div className="card-demo">
        <div className="card">
          <div className="card__header">
            <Heading as='h3'>{title}</Heading>
          </div>
          <div className="card__body">
            <p>{description}</p>
          </div>
          <div className="card__footer">
            <Link
              className={clsx(
                "button",
                "button--" + buttonType,
                "button--block",
              )}
              to={link}>
              {buttonName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomepageCards(): React.JSX.Element {
  return (
    <section className={clsx("margin-top--lg", "margin-bottom--lg")}>
      <div className="container">
        <Heading as='h1'>Quick Links</Heading>
        <hr />
        <div className="row">
          {CardList.map((props, idx) => (
            <Card key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
