# Technical Decisions

## Stack Rationale
- **Next.js 14 App Router:** Chosen for its robust routing, easy component structure, and Server Actions capabilities (which we used for secure AI integration).
- **Tailwind CSS & shadcn/ui:** Allowed for rapid, pixel-perfect styling that matches the DoorDash design system.
- **Zustand:** Ideal for lightweight, client-side state management without the overhead of Redux or a backend database.
- **Framer Motion:** Provided the smooth slide and fade transitions necessary to simulate a native iOS feel.

## Why Client-Side?
The prompt required a risk-free demo that the team could present without setup. A fully client-side prototype with mock data guarantees 100% uptime during the pitch.

## Why Phone Frame?
The prototype is presented on a laptop, but the product is a mobile app. Embedding it in an iPhone 15 Pro frame ensures the audience evaluates it as a mobile experience.