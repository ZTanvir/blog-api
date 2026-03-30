const prisma = require("../config/dbClient");

const posts = [
  {
    title: "The Future of TypeScript in 2026",
    excerpt:
      "Exploring the latest features and why TS remains the king of web dev.",
    content:
      "With the recent updates to the compiler, TypeScript has managed to bridge the gap between performance and developer experience. In 2026, we are seeing the widespread adoption of 'Ambient Type Inference,' which allows the compiler to understand complex patterns without explicit annotations. This reduces boilerplate while maintaining 100% type safety. Furthermore, the integration with native WebAssembly modules has made TypeScript a powerhouse for performance-critical applications that previously required Rust or C++. As we look toward the end of the decade, the focus is shifting toward deep-integrated IDE tooling that can predict architectural flaws before a single line of code is even committed.",
    tag: ["TypeScript", "WebDev", "Programming"],
    published: true,
    userId: 18,
  },
  {
    title: "10 Tips for Better Database Schema Design",
    excerpt: "Avoid common pitfalls when structuring your Prisma models.",
    content:
      "Normalization is key, but sometimes a little denormalization goes a long way for read performance. When designing your schema, always start by defining the relationships clearly—is it one-to-one, one-to-many, or many-to-many? Using Prisma's @relation attribute effectively can save you hours of manual joining later. Tip number one: Always use meaningful IDs. While autoincrementing integers are easy, UUIDs or ULIDs are often better for distributed systems to avoid ID collisions. Tip number two: Index your foreign keys. Many developers forget that while relations link tables, they don't automatically create indexes for performance. Tip number three: Use Enums for fixed sets of values like 'PostStatus' to keep your data clean and predictable.",
    tag: ["Databases", "Prisma", "SQL"],
    published: true,
    userId: 18,
  },
  {
    title: "Mastering CSS Grid in 20 Minutes",
    excerpt: "Stop using floats and start using modern layout tools.",
    content:
      "Grid layout is the most powerful layout system available in CSS. It is a 2D system, meaning it can handle both columns and rows, unlike Flexbox which is largely 1D. To master Grid, you first need to understand the 'fr' unit—a fractional unit that represents a portion of the available space. By using 'grid-template-areas', you can literally draw your website layout in your code, making it incredibly intuitive to read. We will also explore the 'minmax()' function, which allows for truly fluid designs that adapt to screen sizes without a dozen media queries. By the end of this guide, you will be able to build a complex dashboard layout in under 10 lines of CSS.",
    tag: ["CSS", "Frontend", "Design"],
    published: true,
    userId: 18,
  },
  {
    title: "Why We Switched to Edge Computing",
    excerpt:
      "A look at how moving logic closer to users reduced our latency by 40%.",
    content:
      "Vercel and Cloudflare have made it incredibly easy to deploy functions at the edge, but there are trade-offs you should know about. In our latest migration, we moved our authentication logic and A/B testing middleware to the Edge. The results were staggering: global latency dropped from 200ms to an average of 45ms. However, we had to learn the hard way that Edge Runtimes do not support all Node.js APIs. You cannot use heavy libraries like 'fs' or certain crypto modules. We had to refactor our database calls to use HTTP-based drivers rather than traditional TCP connections. This post outlines the architectural shift and the 'Edge-first' mindset required to build modern, global applications.",
    tag: ["Architecture", "Performance", "Cloud"],
    published: true,
    userId: 18,
  },
  {
    title: "A Guide to Sustainable Coding",
    excerpt: "Reducing the carbon footprint of your digital infrastructure.",
    content:
      "Every line of code requires energy to run. Optimization isn't just for speed; it's for the planet. In this post, we discuss how 'Green Software Engineering' is becoming a standard. This includes choosing regions for your data centers that run on renewable energy and optimizing background jobs to run during 'low-carbon' hours. We also dive into the efficiency of different programming languages. Did you know that Rust and C use significantly less energy than Python or Ruby? While developer productivity is important, we must start weighing the environmental cost of our tech stack choices. We'll look at tools like Carbon SDK to help you measure the footprint of your next deployment.",
    tag: ["Sustainability", "Tech", "Ethics"],
    published: false,
    userId: 18,
  },
  {
    title: "The Rise of AI-Driven Development",
    excerpt: "How LLMs are changing the way we write code and solve problems.",
    content:
      "Generative AI is no longer just a gimmick; it's a core part of the modern developer's toolkit. We are moving from 'writing' code to 'reviewing' code generated by AI agents. This shift requires a change in skill sets. Instead of memorizing syntax, developers must get better at system design, prompt engineering, and security auditing. In this article, we showcase a workflow where an AI agent builds a full-stack feature—including migrations, API routes, and frontend components—based on a single natural language description. We also discuss the ethical implications: who owns the code? And how do we ensure that junior developers still learn the fundamentals when the 'hard parts' are being automated?",
    tag: ["AI", "Future", "Productivity"],
    published: true,
    userId: 18,
  },
  {
    title: "Understanding GraphQL Subscriptions",
    excerpt: "Real-time data updates without the headache of WebSockets.",
    content:
      "GraphQL subscriptions are a way to push data from the server to the clients that choose to listen to real-time messages. Unlike Queries and Mutations, which follow a typical Request-Response cycle, Subscriptions keep a steady connection open. This is usually implemented via WebSockets, but the GraphQL layer abstracts the complexity away. In this deep dive, we build a real-time chat application. We'll cover how to set up a PubSub engine (like Redis) to handle events across multiple server instances. We also tackle common pitfalls, such as authorization in long-lived connections and how to handle reconnection logic on the client side without losing the state of the UI.",
    tag: ["GraphQL", "APIs", "Backend"],
    published: true,
    userId: 18,
  },
  {
    title: "Testing Strategy for Startups",
    excerpt: "Unit, Integration, and E2E: What you actually need to ship fast.",
    content:
      "You don't need 100% coverage, you need 100% confidence in your mission-critical paths. For a startup, speed is the primary advantage, and over-testing can be just as deadly as not testing at all. We recommend the 'Testing Trophy' approach. Focus heavily on integration tests that ensure your components work together. Use E2E tests for 'the money paths'—like signing up or checking out. Use unit tests only for complex logic and utility functions. We'll show you how to set up Vitest and Playwright to create a pipeline that catches 90% of bugs with only 20% of the effort. This isn't about perfection; it's about building a safety net that lets you deploy to production on a Friday afternoon without fear.",
    tag: ["Testing", "DevOps", "Startups"],
    published: true,
    userId: 18,
  },
  {
    title: "Building Accessible React Components",
    excerpt: "Making sure the web is usable for everyone.",
    content:
      "Accessibility (a11y) is often treated as an afterthought, but it's a fundamental part of quality engineering. In this post, we walk through the creation of a custom 'Select' component that is fully keyboard-navigable and screen-reader friendly. We'll discuss ARIA roles, the importance of focus management, and why you should almost always prefer native HTML elements over custom divs. We also explore the 'prefers-reduced-motion' media query to ensure that your flashy animations don't cause physical discomfort for users with vestibular disorders. Building for accessibility doesn't just help people with disabilities; it improves the user experience for everyone, including power users who prefer keyboard shortcuts.",
    tag: ["React", "A11y", "Frontend"],
    published: true,
    userId: 18,
  },
  {
    title: "Mental Health in Tech",
    excerpt:
      "Dealing with burnout and impostor syndrome in a fast-paced industry.",
    content:
      "It's okay not to know everything. The industry moves fast, and resting is as productive as coding. Burnout in the software world is often a slow burn, characterized by a loss of interest in side projects and a feeling of dread before stand-up meetings. We talk to three senior engineers who have navigated burnout and come out the other side. They share strategies like 'aggressive boundary setting' and the importance of hobbies that have absolutely nothing to do with a screen. We also tackle Impostor Syndrome: the feeling that you're a fraud despite your achievements. Spoiler alert: almost everyone feels it, especially when working with new technologies. Learn how to foster a culture of 'psychological safety' within your team so everyone feels comfortable saying 'I don't know.'",
    tag: ["Health", "Career", "Mindset"],
    published: true,
    userId: 18,
  },
];

async function main() {
  console.log("Post seeding started");
  for (let post of posts) {
    await prisma.posts.create({
      data: post,
    });
  }
  console.log("Post seeding finished.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
