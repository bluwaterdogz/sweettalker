# Coding Conventions & Architectural Guidelines

This document outlines the key code style and architectural conventions for this project. **Update this file whenever a new convention is established.**

---

## 1. File & Module Structure

- **Feature code** lives in `src/features/<feature>/`.
- **Reusable UI primitives** (e.g., Loader, Toast) go in `src/components/common/` or `src/lib/` if intended for cross-project reuse.
- **Reusable logic, hooks, and context** that are not feature-specific go in `src/hooks/` or `src/lib/`.
- **Firebase and other backend services** are in `src/services/`.
- **Types and interfaces** are colocated with their module or in a `types.ts` file in the relevant directory.

---

## 2. Service & Provider Patterns

- **Service classes** (e.g., `TranslationService`) are instantiated in a central provider (`src/services/provider.tsx`) and passed as dependencies to features via React context.
- **Firebase service** is implemented as a class (`FirebaseServiceImpl`) that implements a `FirebaseService` interface. It is instantiated in the provider and injected into feature services.
- **User-aware Firestore helpers** (e.g., `addUserDocument`, `getUserCollection`) are methods on the Firebase service class, not scattered throughout the codebase.
- **All Firestore access** (read, write, subscribe) is routed through the Firebase service module for maintainability and testability.
- **Always use TypeScript's constructor parameter properties** for dependency injection and class fields (e.g., `constructor(private client: X, private service: Y) {}`), rather than assigning to variables in the constructor body.

---

## 3. Hooks

- **Data fetching hooks** (e.g., `useServiceFetch`) and **subscription hooks** (e.g., `useServiceSubscribe`) are generic and reusable, managing loading, error, and result state.
- Hooks accept a dependency array to control when the effect runs.

---

## 4. Toasts & UI Feedback

- Toast logic (provider, hook, component) is in `src/lib/toast/` for maximum reusability.
- Toasts are provided via context and accessed with `useToast`.

---

## 5. Redux & Async Logic

- **Thunks** are placed in a `thunks.ts` file in the feature directory.
- **Slices** and reducers are in `slice.ts`.
- **Async side effects** (e.g., persisting to Firestore) are handled in thunks, not in service methods.

---

## 6. Type Safety & Interfaces

- All services and modules should have explicit TypeScript interfaces.
- Prefer dependency injection (passing services as constructor arguments) for testability and flexibility.

---

## 7. General Best Practices

- **Keep business logic and side effects out of components.**
- **Favor composition and modularity.**
- **Update this document whenever a new convention is established.**

---

_Last updated: 2024-05-05_
