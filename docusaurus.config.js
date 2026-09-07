const fs = require("fs");
const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Consensys Web3Signer",
  tagline:
    "An open-source, client-agnostic, Ethereum signing service written in Java that is capable of signing on multiple platforms.",
  url: "https://docs.web3signer.consensys.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    }
  },
  favicon: "img/favicon.ico",
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Consensys", // Usually your GitHub org/user name.
  projectName: "doc.web3signer", // Usually your repo name.
  deploymentBranch: "gh-pages", // Github Pages deploying branch

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Set a base path separate from default /docs
          editUrl: "https://github.com/Consensys/doc.web3signer/tree/main/",
          path: "docs",
          routeBasePath: "/",
          breadcrumbs: true,
          // @ts-ignore
          // eslint-disable-next-line global-require
          include: ["**/*.md", "**/*.mdx"],
          exclude: [
            "**/_*.{js,jsx,ts,tsx,md,mdx}",
            "**/_*/**",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__tests__/**",
          ],
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          includeCurrentVersion: true,
          lastVersion: "26.7.0",
          versions: {
            //defaults to the ./docs folder
            // using 'development' instead of 'next' as path
            current: {
              label: "development",
              path: "development",
            },
            //the last stable release in the versioned_docs/version-1.0
            "26.7.0": {
              label: "stable (26.7.0)",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // algolia: {
      //   // The application ID provided by Algolia
      //   appId: "NSRFPEJ4NC",

      //   // Public API key: it is safe to commit it
      //   apiKey: "cea41b975ad6c9a01408dfda6e0061d3",

      //   indexName: "web3signer",

      //   // Optional: see doc section below
      //   contextualSearch: true,

      //   // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      //   externalUrlRegex: "external\\.com|domain\\.com",

      //   // Optional: Algolia search parameters
      //   searchParameters: {},

      //   // Optional: path for search page that enabled by default (`false` to disable it)
      //   searchPagePath: "search",

      //   // ... other Algolia params
      // },
      // announcementBar: {
      //   id: "announcement_bar",
      //   content: "⛔️ This documentation site is still under construction! 🚧",
      //   backgroundColor: "#fafbfc",
      //   textColor: "#091E42",
      //   isCloseable: false,
      // },
      metadata: [
        {name: 'keywords', content: 'remote signer, remote signing, key management, signing keys, vault support, Ethereum, secure signing'},
      ],
      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: "Web3Signer",
        logo: {
          alt: "Web3Signer",
          src: "img/logo.svg",
          srcDark: "img/logo_dark.svg",
          width: 32,
          height: 32,
        },
        items: [
          {
            type: "docsVersionDropdown",
            position: "right",
            dropdownActiveClassDisabled: true,
          },
          {
            href: "https://github.com/Consensys/web3signer",
            className: "header-github-link",
            position: "right",
          },
          {
            href: "https://discord.com/invite/consensys",
            className: "header-discord-link",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Introduction",
                to: "/",
              },
              {
                label: "How to",
                to: "/how-to",
              },
              {
                label: "Concepts",
                to: "/concepts",
              },
              {
                label: "Tutorials",
                to: "/tutorials",
              },
            ],
          },
          {
            title: "Reference",
            items: [
              {
                label: "Command line options",
                to: "/reference/cli/options",
              },
              {
                label: "Subcommands",
                to: "/reference/cli/subcommands",
              },
              {
                label: "JSON-RPC API",
                to: "/reference/api/json-rpc",
              },
              {
                label: "REST API",
                to: "/reference/api/rest",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Consensys Discord",
                href: "https://discord.com/invite/consensys",
              },
              {
                label: "Web3Signer GitHub",
                href: "https://github.com/Consensys/web3signer",
              },
              {
                label: "Web3Signer documentation GitHub",
                href: "https://github.com/Consensys/doc.web3signer",
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Consensys, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["solidity", "toml"],
      },
      languageTabs: [
        {
          highlight: "bash",
          language: "curl",
          logoClass: "bash",
        },
        {
          highlight: "python",
          language: "python",
          logoClass: "python",
        },
        {
          highlight: "go",
          language: "go",
          logoClass: "go",
        },
        {
          highlight: "javascript",
          language: "nodejs",
          logoClass: "nodejs",
        },
      ],
    }),
  plugins: [
    [
      "@docusaurus/plugin-google-gtag",
      {
        trackingID: "G-159G82NNKS",
        anonymizeIP: true,
      },
    ],
    [
      "@docusaurus/plugin-google-tag-manager",
      {
        containerId: "GTM-PJ8HNLB",
      },
    ],
    [
      "docusaurus-plugin-llms",
      {
        docsDir: "docs",
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        title: "Web3Signer documentation",
        description:
          "An open-source, client-agnostic, Ethereum signing service written in Java that is capable of signing on multiple platforms.",
        excludeImports: true,
        removeDuplicateHeadings: true,
        logLevel: process.env.CI ? "quiet" : "normal",
        ignoreFiles: ["img/**"],
        includeOrder: [
          "get-started/**/*",
          "concepts/**/*",
          "how-to/**/*",
          "tutorials/**/*",
          "reference/**/*",
        ],
      },
    ],    
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/HowTo/Get-Started/Install-Binaries",
            to: "/get-started/install-binaries",
          },
          {
            from: "/reference/api/filecoin",
            to: "/reference/api",
          },
          {
            from: "/HowTo/Get-Started/Build-From-Source",
            to: "/get-started/build-from-source",
          },
          {
            from: "/HowTo/Get-Started/Use-Docker",
            to: "/get-started/use-docker",
          },
          {
            from: "/HowTo/Get-Started/Start-Web3Signer",
            to: "/get-started/start-web3signer",
          },
          {
            from: "/HowTo/Monitor/Logging",
            to: "/how-to/monitor/logging",
          },
          {
            from: "/HowTo/Monitor/Metrics",
            to: "/how-to/monitor/metrics",
          },
          {
            from: "/HowTo/Store-Keys-HSM/Use-USB-Armory",
            to: "/",
          },
          {
            from: "/HowTo/Store-Keys-HSM/Use-YubiHSM2",
            to: "/",
          },
          {
            from: "/HowTo/Store-Keys-Vaults/Use-AWS",
            to: "/how-to/store-keys/vaults/aws",
          },
          {
            from: "/HowTo/Store-Keys-Vaults/Use-Azure",
            to: "/how-to/store-keys/vaults/azure",
          },
          {
            from: "/HowTo/Store-Keys-Vaults/Use-Hashicorp",
            to: "/how-to/store-keys/vaults/hashicorp",
          },
          {
            from: "/HowTo/Configure-Slashing-Protection",
            to: "/how-to/configure-slashing-protection",
          },
          {
            from: "/HowTo/Configure-TLS",
            to: "/how-to/configure-tls",
          },
          {
            from: "/HowTo/Deploy-With-Kubernetes",
            to: "/how-to",
          },
          {
            from: "/HowTo/Use-Configuration-File",
            to: "/how-to/use-configuration-file-starting-web3signer",
          },
          {
            from: "/HowTo/Use-Signing-Keys",
            to: "/how-to/load-keys",
          },
          {
            from: "/Reference/CLI/CLI-Syntax",
            to: "/reference/cli/options",
          },
          {
            from: "/Reference/CLI/CLI-Subcommands",
            to: "/reference/cli/subcommands",
          },
          {
            from: "/Reference/Key-Configuration-Files",
            to: "/reference/key-config-file-params",
          },
          {
            from: "/Reference/Responsible-Disclosure",
            to: "/reference/security-disclosure",
          },
          {
            from: "/Tutorials/Launchpad-Keystores",
            to: "/tutorials/load-launchpad-keystores",
          },
          {
            from: "/category/get-started",
            to: "/get-started",
          },
          {
            from: "/category/how-to",
            to: "/how-to",
          },
          {
            from: "/category/tutorials",
            to: "/tutorials",
          },
          {
            from: "/category/reference",
            to: "/reference",
          },
          {
            from: "/category/monitor-nodes",
            to: "/how-to/monitor",
          },
          {
            from: "/category/store-keys-in-an-hsm-device",
            to: "/",
          },
          {
            from: "/category/store-keys-in-an-external-vault",
            to: "/how-to/store-keys/vaults",
          },
          {
            from: "/category/apis",
            to: "/reference/api",
          },
          {
            from: "/category/command-line",
            to: "/reference/cli",
          },
          {
            from: "/how-to/store-keys-hsm",
            to: "/",
          },
          {
            from: "/how-to/store-keys-hsm/usb-armory",
            to: "/",
          },
          {
            from: "/how-to/use-signing-keys",
            to: "/how-to/load-keys",
          },
          {
            from: "/how-to/configure-access-keys",
            to: "/how-to/load-keys",
          },
          {
            from: "/how-to/store-keys-hsm/yubihsm2",
            to: "/",
          },
          {
            from: "/how-to/store-keys-vaults",
            to: "/how-to/store-keys/vaults",
          },
          {
            from: "/how-to/store-keys-vaults/aws",
            to: "/how-to/store-keys/vaults/aws",
          },
          {
            from: "/how-to/store-keys-vaults/azure",
            to: "/how-to/store-keys/vaults/azure",
          },
          {
            from: "/how-to/store-keys-vaults/hashicorp",
            to: "/how-to/store-keys/vaults/hashicorp",
          },
          {
            from: "/how-to/use-configuration-file",
            to: "/how-to/use-configuration-file-starting-web3signer",
          },
          {
            from: "/how-to/deploy-with-kubernetes",
            to: "/how-to",
          },
        ],
      },
    ],
  ],
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        docsRouteBasePath: "/",
        hashed: true,
        indexBlog: false,
        askAi: {
          project: "web3signer",                 
          apiUrl: process.env.ASK_AI_API_URL || "http://localhost:5000/api/stream?api_key=....",
          hotkey: "cmd+k",
          texts: {
            welcomeMessage:
              "Hi! I can answer questions about the documentation, its features or usage instructions. Be sure to check the source documentation links that I provide for full details.\n\n" +
              "Please do not input any of your own or another's personal information i.e, passwords, private keys, seed phrases, personal data, or other sensitive information. If you need support and do not want to engage with me, please reach out to us via Discord. Any information that you provide is not used for training my AI systems. For details on our data handling practices, see our Privacy Policy.\n\n" +
              "By proceeding you acknowledge the above.",
            inputPlaceholder: "Please ask a question",
          }              
        },        
      },
    ],
  ],
};

module.exports = config;

 