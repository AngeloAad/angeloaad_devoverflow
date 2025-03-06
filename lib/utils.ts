import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { techMap } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const techDescriptionMap: { [key: string]: string } = {
  javascript:
    "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
  typescript:
    "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
  react:
    "React is a popular library for building fast and modular user interfaces.",
  nextjs:
    "Next.js is a React framework for server-side rendering and building optimized web applications.",
  nodejs:
    "Node.js enables server-side JavaScript, allowing you to create fast, scalable network applications.",
  python:
    "Python is a versatile language known for readability and a vast ecosystem, often used for data science and automation.",
  java: "Java is an object-oriented language commonly used for enterprise applications and Android development.",
  cplusplus:
    "C++ is a high-performance language used for system/software development, game development, and more.",
  csharp:
    "C# is a versatile language developed by Microsoft, commonly used for Windows applications and game development with Unity.",
  php: "PHP is a server-side scripting language designed for web development and creating dynamic web pages.",
  ruby: "Ruby is known for its simplicity and productivity, often used with the Rails framework for web development.",
  swift:
    "Swift is Apple's programming language for iOS, macOS, watchOS, and tvOS development.",
  kotlin:
    "Kotlin is a modern programming language that runs on the JVM, primarily used for Android development.",
  go: "Go (Golang) is a statically typed, compiled language designed at Google, known for simplicity and efficiency.",
  rust: "Rust is a systems programming language focused on safety, speed, and concurrency.",
  dart: "Dart is a client-optimized language for fast apps on multiple platforms, developed by Google.",
  flutter:
    "Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.",
  reactnative:
    "React Native is a framework for building native mobile apps using React and JavaScript.",
  angular:
    "Angular is a platform and framework for building single-page client applications using HTML and TypeScript.",
  vue: "Vue.js is a progressive JavaScript framework for building user interfaces, focused on simplicity and integration.",
  svelte:
    "Svelte is a radical new approach to building user interfaces, compiling code to tiny, framework-less vanilla JS.",
  jquery:
    "jQuery is a fast, small, and feature-rich JavaScript library that simplifies HTML document traversal, event handling, and animation.",
  express:
    "Express.js is a minimal and flexible Node.js web application framework for building web applications and APIs.",
  django:
    "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.",
  flask:
    "Flask is a lightweight WSGI web application framework in Python, designed to make getting started quick and easy.",
  laravel:
    "Laravel is a PHP web application framework with expressive, elegant syntax, designed for web application development.",
  rails:
    "Ruby on Rails is a server-side web application framework written in Ruby, following the MVC pattern.",
  spring:
    "Spring is a comprehensive framework for Java development, providing infrastructure support for developing Java applications.",
  dotnet:
    ".NET is a free, cross-platform, open-source developer platform for building many different types of applications.",
  mongodb:
    "MongoDB is a NoSQL document database with scalability and flexibility.",
  mysql:
    "MySQL is an open-source relational database management system that uses SQL for querying and managing data.",
  postgresql:
    "PostgreSQL is a powerful, open-source object-relational database system known for reliability, feature robustness, and performance.",
  redis:
    "Redis is an in-memory data structure store, used as a database, cache, and message broker.",
  graphql:
    "GraphQL is a query language for APIs and a runtime for executing those queries with existing data, providing a more efficient alternative to REST.",
  apollo:
    "Apollo GraphQL is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.",
  docker:
    "Docker is a platform for developing, shipping, and running applications in containers.",
  kubernetes:
    "Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.",
  aws: "AWS (Amazon Web Services) is a comprehensive cloud computing platform offering over 200 services from data centers globally.",
  azure:
    "Microsoft Azure is a cloud computing service for building, testing, deploying, and managing applications and services.",
  gcp: "Google Cloud Platform (GCP) is a suite of cloud computing services that runs on the same infrastructure that Google uses internally.",
  firebase:
    "Firebase is a platform developed by Google for creating mobile and web applications, providing tools for database, authentication, and hosting.",
  heroku:
    "Heroku is a cloud platform as a service supporting several programming languages.",
  vercel:
    "Vercel is a deployment and collaboration platform for frontend developers.",
  netlify:
    "Netlify is a web development platform that multiplies productivity.",
  git: "Git is a distributed version control system for tracking changes in source code during software development.",
  github:
    "GitHub is a platform for hosting and collaborating on Git repositories.",
  gitlab:
    "GitLab is a web-based DevOps lifecycle tool that provides a Git repository manager.",
  webpack:
    "Webpack is a static module bundler for modern JavaScript applications.",
  babel:
    "Babel is a JavaScript compiler that allows you to use next-generation JavaScript today.",
  sass: "SASS is a preprocessor scripting language that is interpreted or compiled into CSS, adding features like variables and nested rules.",
  tailwind:
    "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces without writing custom CSS.",
  bootstrap:
    "Bootstrap is a popular CSS framework for developing responsive and mobile-first websites.",
  materialui:
    "Material-UI is a popular React UI framework implementing Google's Material Design.",
  styledcomponents:
    "Styled Components is a library for React and React Native that allows you to use component-level styles in your application.",
  jest: "Jest is a delightful JavaScript testing framework with a focus on simplicity.",
  mocha:
    "Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser.",
  cypress:
    "Cypress is a next-generation front-end testing tool built for the modern web.",
  selenium: "Selenium is a portable framework for testing web applications.",
  electron:
    "Electron is a framework for creating native applications with web technologies like JavaScript, HTML, and CSS.",
  pwa: "Progressive Web Apps (PWA) use modern web capabilities to deliver app-like experiences to users.",
  webassembly:
    "WebAssembly (WASM) is a binary instruction format for a stack-based virtual machine, enabling high-performance applications on web pages.",
  tensorflow:
    "TensorFlow is an open-source machine learning framework developed by Google.",
  pytorch:
    "PyTorch is an open-source machine learning library developed by Facebook's AI Research lab.",
  solidity:
    "Solidity is an object-oriented programming language for writing smart contracts on Ethereum.",
  ethereum:
    "Ethereum is a decentralized, open-source blockchain with smart contract functionality.",
  figma:
    "Figma is a vector graphics editor and prototyping tool primarily web-based.",
  adobexd:
    "Adobe XD is a vector-based user experience design tool for web apps and mobile apps.",
  sketch:
    "Sketch is a vector graphics editor for macOS used primarily for user interface and user experience design.",
  nginx:
    "Nginx is a web server that can also be used as a reverse proxy, load balancer, mail proxy, and HTTP cache.",
  apache:
    "Apache is a widely-used web server software that played a key role in the initial growth of the World Wide Web.",
  jenkins:
    "Jenkins is an open-source automation server that enables developers to build, test, and deploy software.",
  terraform:
    "Terraform is an open-source infrastructure as code software tool that enables you to safely and predictably create, change, and improve infrastructure.",
  ansible:
    "Ansible is an open-source software provisioning, configuration management, and application deployment tool.",
  gatsby:
    "Gatsby is a React-based open-source framework for creating websites and apps.",
  storybook:
    "Storybook is an open-source tool for developing UI components in isolation.",
  elixir:
    "Elixir is a functional, concurrent, general-purpose programming language that runs on the BEAM virtual machine.",
  phoenix:
    "Phoenix is a web development framework written in Elixir which implements the server-side MVC pattern.",
  haskell:
    "Haskell is a statically typed, purely functional programming language with type inference and lazy evaluation.",
  clojure:
    "Clojure is a dynamic, general-purpose programming language, combining the approachability of a scripting language with an efficient infrastructure for multithreaded programming.",
  scala:
    "Scala is a strong static type system that combines object-oriented and functional programming.",
};

export const getTechDescription = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  return techDescriptionMap[normalizedTechName]
    ? techDescriptionMap[normalizedTechName]
    : `${techName} is a technology or tool widely used in web development, providing valuable features and capabilities.`;
};

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
};

export const getTimeStamp = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();

  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

export const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};
