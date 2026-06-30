const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * Fallback Mock Generator to ensure the app functions even when API key limits are hit.
 */
const getFallbackQuestions = (role, experience, topicsToFocus) => {
  const topics = topicsToFocus ? topicsToFocus.split(',').map(t => t.trim()) : [];
  const focusText = topics.length > 0 ? ` focused on ${topics.join(', ')}` : '';

  // Standard generic template Q&As
  const defaultQuestions = [
    {
      question: `What are the key architectural patterns you would consider when building a modern web application as a ${experience} ${role}?`,
      answer: `When designing modern web applications as a **${experience} ${role}**, several key architectural patterns are critical:\n\n1. **Microservices vs. Monolith**: Depending on team size and domain complexity, choose between a modular monolith or microservices connected via REST/GraphQL or message brokers (Kafka/RabbitMQ).\n2. **State Management**: Separation of local, global, and server states (e.g., Redux, Zustand, React Query for frontend; Redis, DB sessions for backend).\n3. **Caching Strategies**: Multilayer caching (CDN, Redis cache, database indexing) to minimize database load and latencies.\n4. **Database Design**: Choosing the right database (SQL for relational integrity, NoSQL for high scalability and flexible schemas) and modeling clean relationships.\n5. **Security First**: Implementing robust authentication (JWT, OAuth2), HTTPS, CORS policies, secure headers, and sanitizing user inputs.`
    },
    {
      question: `Explain how you would optimize the performance and load times of a application in this role${focusText}.`,
      answer: `Performance optimization is multi-layered:\n\n* **Frontend**: Code-splitting, lazy loading of images and components, using lightweight libraries, minimizing render cycles, caching requests with tools like React Query, and utilizing CDN distribution.\n* **Backend & API**: Implementing database indexes, lazy-fetching records (pagination), using compression middleware (like Gzip), connection pooling, and utilizing in-memory datastores (like Redis).\n* **Network**: Minimize request payload, bundle assets efficiently, use HTTP/2 or HTTP/3, and configure proper HTTP cache headers (Cache-Control).`
    },
    {
      question: `How do you handle API error boundaries, logging, and graceful degradation in production?`,
      answer: `Robust error handling requires:\n\n1. **Global Error Middleware**: Express global error handlers that log detailed errors server-side but return clean, standardized error responses to clients.\n2. **Frontend Error Boundaries**: React Error Boundaries to prevent the entire app from crashing when a single UI component fails.\n3. **Structured Logging**: Using libraries like Winston or Bunyan to write logs in JSON format for easy ingestion by ELK Stack, Datadog, or cloud watchers.\n4. **Circuit Breakers**: Graceful degradation where non-critical service failures (e.g., recommendation engine) do not take down critical flows (e.g., checkout/profile loading).`
    },
    {
      question: `Explain the concept of JWT (JSON Web Tokens). How do you securely store and renew them?`,
      answer: `JSON Web Token (JWT) is a compact, URL-safe means of representing claims between two parties. It is composed of Header, Payload, and Signature.\n\n**Security Best Practices:**\n* **Storage**: Store tokens in HTTP-only, secure cookies with SameSite attributes enabled to protect against XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery).\n* **Short Expiry**: Use short-lived Access Tokens (e.g., 15 mins) and longer-lived Refresh Tokens stored securely in the database.\n* **Token Revocation**: Keep a blacklist of revoked refresh tokens in a fast memory cache like Redis to revoke access immediately if a token is compromised.`
    },
    {
      question: `What is database indexing and how does it work? Mention potential downsides.`,
      answer: `A database index is a data structure (typically a B-Tree or Hash table) that improves the speed of data retrieval operations at the cost of additional writes and storage space.\n\n* **How it works**: Instead of performing a full-table scan, the database queries the index structure, which contains pointers to the actual data rows.\n* **Downsides**:\n  1. **Write Overhead**: Indexes must be updated on every INSERT, UPDATE, or DELETE, slowing down write operations.\n  2. **Storage**: Large indexes consume significant RAM and disk space.\n  3. **Over-indexing**: Having too many indexes can confuse the query optimizer and degrade overall performance.`
    },
    {
      question: `Explain the differences between Monolithic and Microservice architectures. When would you choose one over the other?`,
      answer: `* **Monolithic**: Single, unified codebase and deployment unit.\n  * *Pros*: Simple to build, test, deploy, and debug; low latency.\n  * *Cons*: Scaling issues, single point of failure, tech stack lock-in, slower build times as codebase grows.\n* **Microservices**: Collection of loosely coupled, independently deployable services.\n  * *Pros*: Independent scaling, tech stack freedom, failure isolation, better fit for large/distributed teams.\n  * *Cons*: Operational complexity, complex distributed transactions (Saga pattern), higher latency due to network calls.\n* **Choice**: Start with a modular monolith for startups/MVPs. Transition to microservices when scaling requirements or organizational growth demand independent service ownership.`
    },
    {
      question: `How do you ensure secure communications and protect against OWASP Top 10 vulnerabilities?`,
      answer: `Security strategies should cover:\n\n1. **Injection (SQL, NoSQL, XSS)**: Use ORM/ODMs (Mongoose, Sequelize) with parameterized queries. Sanitize and escape all user inputs.\n2. **Authentication**: Use secure password hashing (bcrypt), implement MFA, rate-limit login endpoints, and use secure JWT/Session practices.\n3. **Sensitive Data Exposure**: Encrypt data in transit (TLS/HTTPS) and at rest. Use environment variables for secrets.\n4. **Broken Access Control**: Enforce authorization checks on every endpoint, not just on the UI (role-based access control).`
    },
    {
      question: `What are WebSockets, and how do they differ from HTTP polling and Server-Sent Events (SSE)?`,
      answer: `* **WebSockets**: A persistent, bi-directional, full-duplex TCP connection established via an HTTP handshake. Ideal for real-time applications like chat or collaborative editors.\n* **HTTP Polling**: Periodic HTTP requests to check for new data. High overhead and latency.\n* **Server-Sent Events (SSE)**: One-way (server-to-client) persistent connection. Great for news feeds, stock tickers, or push notifications where client doesn't need to send continuous data back.`
    },
    {
      question: `Explain standard Git workflows and how you handle merge conflicts in a team environment.`,
      answer: `Common Git workflows include **GitFlow** (main, develop, feature, release, hotfix branches) and **GitHub Flow** (simple feature branches merged directly to main via Pull Requests).\n\n**Merge Conflicts Resolution:**\n1. Run \`git fetch origin\` to ensure your branch is up to date.\n2. Merge or rebase the target branch (e.g., main) into your feature branch.\n3. Locate the conflict markers (\`<<<<<<\`, \`======\`, \`>>>>>>\`) in code and discuss with the other author if unsure.\n4. Resolve conflicts, test locally, add files, and complete the merge/rebase commit.`
    },
    {
      question: `How do you approach writing clean, maintainable code? Mention specific principles you follow.`,
      answer: `Clean code principles include:\n\n* **KISS (Keep It Simple, Stupid)**: Avoid over-engineering. Write code that is easy to read and understand.\n* **DRY (Don't Repeat Yourself)**: Abstract common patterns into reusable helpers, but avoid premature abstraction (duplication is cheaper than the wrong abstraction).\n* **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.\n* **Testing**: Write unit and integration tests to document and verify behavior, serving as executable specifications.`
    }
  ];

  // Tailored frontend/React questions if role suggests it
  if (role.toLowerCase().includes('react') || role.toLowerCase().includes('frontend') || role.toLowerCase().includes('web')) {
    defaultQuestions[1] = {
      question: `Explain React Hooks guidelines, common pitfalls, and how you optimize components using useMemo and useCallback.`,
      answer: `React Hooks allow functional components to manage state and side effects.\n\n**Guidelines & Rules:**\n* Call hooks only at the top level (not inside loops, conditions, or nested functions).\n* Call hooks only from React functional components or custom hooks.\n\n**useMemo vs useCallback:**\n* \`useMemo\` memoizes the **result of a calculation**.\n* \`useCallback\` memoizes the **function definition itself** to prevent re-creation on render.\n\n**Pitfalls**: Overusing memoization when rendering is cheap. Unnecessary hook dependencies or missing dependencies causing stale closures.`
    };
    defaultQuestions[4] = {
      question: `What is the Virtual DOM, and how does React's Reconciliation process work?`,
      answer: `The Virtual DOM is a lightweight, in-memory representation of the real DOM.\n\n**Reconciliation Process:**\n1. **Render**: When state changes, React generates a new Virtual DOM tree.\n2. **Diffing**: React compares the new tree with the previous Virtual DOM tree using a heuristic O(n) algorithm.\n3. **Patching**: React updates only the specific changed nodes in the real HTML DOM, minimizing expensive reflows/repaints.\n4. **Keys**: Using stable, unique \`key\` props helps React identify which items changed, were added, or were removed in lists.`
    };
  }

  // Tailored backend/Node questions if role suggests it
  if (role.toLowerCase().includes('node') || role.toLowerCase().includes('backend') || role.toLowerCase().includes('full stack')) {
    defaultQuestions[0] = {
      question: `Explain Node.js event loop mechanism, non-blocking I/O, and the purpose of libuv.`,
      answer: `Node.js uses a single-threaded event loop architecture powered by Chrome V8 and the libuv C++ library.\n\n**Event Loop Phases:**\n1. **Timers**: Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.\n2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.\n3. **Idle, Prepare**: Used internally.\n4. **Poll**: Retrieves new I/O events; executes I/O-related callbacks.\n5. **Check**: Executes \`setImmediate\` callbacks.\n6. **Close Callbacks**: Executes close event callbacks (e.g., socket close).\n\n**libuv**: Manages the thread pool for operations that cannot be done asynchronously at OS level (like file system tasks or DNS lookups).`
    };
    defaultQuestions[2] = {
      question: `How do you design RESTful APIs? Contrast with GraphQL.`,
      answer: `**RESTful Design Principles:**\n* Use appropriate HTTP methods: \`GET\` (read), \`POST\` (create), \`PUT\` (update), \`DELETE\` (delete).\n* Use nouns for resource paths (e.g., \`/api/sessions\` instead of \`/api/getSessions\`).\n* Standardized HTTP status codes (\`200 OK\`, \`201 Created\`, \`400 Bad Request\`, \`401 Unauthorized\`, \`404 Not Found\`, \`500 Internal Error\`).\n\n**REST vs GraphQL:**\n* **REST**: Multiple endpoints returning fixed data shapes. Can suffer from over-fetching or under-fetching.\n* **GraphQL**: Single endpoint (\`/graphql\`) where client requests specific fields. Eliminates over-fetching; self-documenting schema.`
    };
  }

  return defaultQuestions;
};

/**
 * Generate interview questions and answers using Gemini API
 * Called internally by sessionController
 */
const generateQuestionsAndAnswers = async (role, experience, topicsToFocus, excludeQuestions = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const topicClause = topicsToFocus
      ? `Focus especially on these topics: ${topicsToFocus}.`
      : '';

    const excludeClause = excludeQuestions.length > 0
      ? `\nCRITICAL: DO NOT generate any of the following questions (or very similar ones):\n${excludeQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';

    const prompt = `You are an expert technical interviewer. Generate exactly 5 high-quality interview questions and detailed answers for a ${experience} ${role} position.
${topicClause}${excludeClause}

Format the output strictly as a text document where each question is prefixed with [QUESTION] on a new line, and each answer is prefixed with [ANSWER] on a new line.

Example format:
[QUESTION]
What is React?
[ANSWER]
React is a JavaScript library for building user interfaces.

Make the questions progressively more challenging. Include a mix of conceptual, practical, and scenario-based questions. The answers should be thorough, professional, and include code examples where appropriate using markdown code blocks.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse the [QUESTION] and [ANSWER] blocks
    const parsedQuestions = [];
    const questionBlocks = text.split(/\[QUESTION\]/i).slice(1); // skip preamble if any

    for (const block of questionBlocks) {
      const parts = block.split(/\[ANSWER\]/i);
      if (parts.length >= 2) {
        const question = parts[0].trim();
        const answer = parts[1].trim();
        if (question && answer) {
          parsedQuestions.push({ question, answer });
        }
      }
    }

    if (parsedQuestions.length === 0) {
      throw new Error('Failed to parse any questions from response text');
    }

    return { questions: parsedQuestions, isAIGenerated: true };
  } catch (error) {
    console.warn(`⚠️ Gemini API error: ${error.message}. Returning fallback questions.`);
    return { questions: getFallbackQuestions(role, experience, topicsToFocus), isAIGenerated: false };
  }
};

/**
 * Generate a concept explanation using Gemini API
 * Exposed via HTTP endpoint
 */
const generateConceptExplanation = async (req, res) => {
  try {
    const { concept, context } = req.body;

    if (!concept) {
      return res.status(400).json({ message: 'Concept is required' });
    }

    let explanation;
    try {
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const contextClause = context
        ? `The question context is: "${context}"`
        : '';

      const prompt = `You are an expert software engineer and technical educator. Provide a clear, comprehensive, and beginner-to-expert explanation of the following concept:

**Concept:** ${concept}
${contextClause}

Your explanation should include:
1. A simple, intuitive definition
2. How it works (step by step if applicable)
3. Real-world use cases and examples
4. Code examples (in relevant programming languages) using markdown code blocks
5. Common pitfalls and best practices
6. How it compares to similar concepts (if relevant)

Format your response in clean markdown with proper headers, bullet points, and code blocks.`;

      const result = await model.generateContent(prompt);
      explanation = result.response.text();
    } catch (apiError) {
      console.warn(`⚠️ Gemini API explanation error: ${apiError.message}. Using mock explanation.`);
      explanation = `### Concept Deep Dive: ${concept}\n\nHere is an expert breakdown of the requested concept.\n\n#### 1. Intuitive Definition\nThis concept refers to a fundamental architectural design pattern or programming paradigm used to solve core structural, scaling, or logical challenges in modern software development.\n\n#### 2. Core Mechanics\n* It operates by establishing abstractions over lower-level logic, isolating state changes, and maintaining strict execution context.\n* Enables modular separation, making subsystems independently maintainable, testable, and hot-swapping-friendly.\n\n#### 3. Real-World Code Example\n\`\`\`javascript\n// Conceptual Implementation\nclass ConceptDemo {\n  constructor(config = {}) {\n    this.config = config;\n    this.isActive = true;\n  }\n\n  execute(payload) {\n    if (!this.isActive) throw new Error("Service unavailable");\n    console.log("Processing concept task with:", payload);\n    return { success: true, timestamp: Date.now() };\n  }\n}\n\nconst demo = new ConceptDemo({ debug: true });\ndemo.execute({ key: "exampleValue" });\n\`\`\`\n\n#### 4. Pitfalls & Best Practices\n* **Pitfall**: Premature optimization or over-abstraction. Keep solutions simple until complexity is validated.\n* **Best Practice**: Document access points, write comprehensive integration tests, and profile performance boundaries under simulated heavy loads.\n\n*(Note: This explanation was generated via the offline system fallback due to API quota limitations)*`;
    }

    res.json({ explanation });
  } catch (error) {
    console.error('Concept explanation handler error:', error.message);
    res.status(500).json({ message: 'Failed to process concept explanation request.' });
  }
};

/**
 * Re-generate questions for an existing session
 */
const regenerateQuestionsForSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus } = req.body;

    if (!role || !experience) {
      return res.status(400).json({ message: 'Role and experience are required' });
    }

    const questions = await generateQuestionsAndAnswers(role, experience, topicsToFocus);
    res.json({ questions });
  } catch (error) {
    console.error('Regenerate questions error:', error.message);
    res.status(500).json({ message: 'Failed to generate questions. Please try again.' });
  }
};

module.exports = {
  generateQuestionsAndAnswers,
  generateConceptExplanation,
  regenerateQuestionsForSession,
};
