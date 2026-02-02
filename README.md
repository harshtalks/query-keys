# @harshtalks/query-keys

`@harshtalks/query-keys` is a small utility that works with **@tanstack/react-query** to:

- Generate strongly‑typed query key functions.
- Attach optional **annotations** (metadata) to each key.
- Invalidate or reset queries based on keys **or** annotation filters.

## Installation

```bash
npm install @tanstack/react-query
# or
yarn add @tanstack/react-query
```

> The `QueryKeyFactory` class itself lives in your code‑base (e.g. `src/QueryKeyFactory.ts`).

## Basic Concepts

| Concept                | Description                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| **Query key function** | A function that returns the array React Query expects, e.g. `["users"]` or `["post", { id: 42 }]`.       |
| **Annotation**         | Any extra data you want to associate with a key – e.g. a user role, a feature flag, etc.                 |
| **Factory**            | Holds all generated functions and a map of annotations, exposing helpers for invalidation and resetting. |

## Quick Start

```ts
import { QueryClient } from '@tanstack/react-query';
import QueryKeyFactory from './QueryKeyFactory';

/* 1️⃣ Initialise React Query client */
const queryClient = new QueryClient();

/* 2️⃣ Create a factory – optionally type your annotation shape */
type MyAnnotations = { role: string };
const factory = new QueryKeyFactory<MyAnnotations>(queryClient);

/* 3️⃣ Register keys */
factory
  .createQueryKey('users', { role: 'admin' }) // simple key
  .createQueryKeyWithArgs('posts')<[{ id: number }]>() // key with args
  .annotateQueryKey('posts', { role: 'editor' });

/* 4️⃣ Use the generated key functions */
const usersKey = factory.keys.users(); // ["users"]
const postKey = factory.keys.posts({ id: 42 }); // ["posts", { id: 42 }]

/* 5️⃣ Invalidate / reset queries */
factory.invalidateQueries('users'); // invalidate all "users" queries
factory.resetQueryByAnnotations({ role: 'editor' }); // reset every query annotated as editor
```

## API Reference

### `new QueryKeyFactory<Annotations>(queryClient)`

Creates a factory instance.

- **`Annotations`** – shape of the optional metadata attached to each key.
- **`queryClient`** – the `QueryClient` from React Query.

### Registering Keys

| Method                                      | Signature                                                                                                                                                                                    | Description                                                                                                        |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `createQueryKey(key, annotation?)`          | `<Key extends string>(key: Key, annotation?: Annotations) => QueryKeyFactory<Annotations, Merge<TKeysObject, { [k in Key]: GenerateQueryKey<Key> }>>`                                        | Adds a **no‑args** query key.                                                                                      |
| `createQueryKeyWithArgs(key, annotations?)` | `<Key extends string>(key: Key, annotations?: Annotations) => <U extends unknown[]>() => QueryKeyFactory<Annotations, Merge<TKeysObject, { [k in Key]: GenerateQueryKeyWithArgs<Key, U> }>>` | Returns a higher‑order function that receives the argument tuple type (`U`) and registers a **parameterised** key. |
| `annotateQueryKey(key, annotation)`         | `(key: keyof TKeysObject, annotation: Annotations) => this`                                                                                                                                  | Merges additional annotation data into an already‑registered key.                                                  |

### Accessors & Helpers

- `keys` – Getter that returns the record of generated query‑key functions (`factory`).
- `getQueryKeyFn(key)` – Returns the stored query‑key function for `key`. Throws if the key is not registered.
- `getQueryKeys(...keys)` – Returns only the base part (first element) of each supplied key.
- `getQueryKeyAnnotations(key)` – Retrieves the stored annotation object for a key.

### Invalidation & Resetting

| Method                                 | Signature                                  | Behaviour                                                              |
| -------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| `invalidateQueries(...keys)`           | `(...keys: (keyof TKeysObject)[]) => void` | Calls `queryClient.invalidateQueries` for the supplied base keys.      |
| `resetQueries(...keys)`                | `(...keys: (keyof TKeysObject)[]) => void` | Calls `queryClient.resetQueries` for the supplied base keys.           |
| `invalidateQueryByAnnotations(filter)` | `(filter: Partial<Annotations>) => void`   | Invalidates **all** queries whose stored annotations match the filter. |
| `resetQueryByAnnotations(filter)`      | `(filter: Partial<Annotations>) => void`   | Resets **all** queries whose stored annotations match the filter.      |

### Private Helpers (for internal use)

- `queryFiltering(keys)` – Builds a predicate function used by the `QueryClient` methods.
- `getQueryKeysFromAnnotation(annotations)` – Returns an array of key names that satisfy a partial annotation filter.

## When to Use QueryKeyFactory

- **Consistent key generation** across a large code‑base.
- **Typed argument lists** (helps prevent runtime bugs).
- **Metadata‑driven cache control**, e.g. invalidating all queries for a specific user role, feature flag, or tenant.
- **Centralised registration**, making it easy to audit which keys exist.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/…`).
3. Run tests (`npm test` – add tests for new behaviour).
4. Submit a pull request.

## License

MIT © 2024 Your Company / Open Source Contributors
