# React Project Guidelines

## Table of Contents

1. [Introduction](#introduction)
2. [Code Style](#code-style)
3. [Localization](#localization)
4. [Router Manual](#manual-for-adding-new-routes-to-the-router-component)
5. [Page Templates](#)

## Introduction

Welcome to the BUSINESSCLIENT repository! This document outlines the rules and best practices for contributing to this project. Adhering to these guidelines will help us maintain a clean and efficient codebase.

## Code Style

- Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).
- Use `Typescript-Eslint` for linting and `Prettier` for code formatting.
- Component names should be in `PascalCase`.
- **Do not use plain text in the code**. Always retrieve strings from our localization files.


## Localization

To ensure our application is accessible to a diverse audience, **do not use plain text in the code**. Always retrieve strings from our localization files.

### Guidelines
- Use the localization library (e.g., `react-i18next`, `react-intl`) for all text strings.
- Store all user-facing text in the appropriate localization files.
- Use descriptive keys for localization strings to improve readability.

### Example
Instead of writing:
```jsx
    <div>Hello, World!</div>
```
Use localization:
```jsx
    import { useTranslation } from 'react-i18next';

    const MyComponent = () => {
        const { t } = useTranslation();
        
        return <div>{t('greeting.hello')}</div>;
    };
```

## Manual for Adding New Routes to the Router Component

### Step 1: Identify the Route Type

There are two types of routes in the Router:

1. Public Routes: Accessible to all users (unauthenticated).
2. Protected Routes: Accessible only to authenticated users with specific roles.

Decide whether the new route should be public or protected.

### Step 2: Create a New Component

If you don’t already have a component for the new page, create one. For example, create a file named NewPage.jsx in the pages directory.

```jsx
// src/pages/NewPage.js
import React from 'react';

const NewPage = () => {
    return <h1>This is the New Page</h1>;
};

export default NewPage;
```

### Step 3: Import the New Page Component

In your Router.js file, import the newly created component at the top:

```jsx
export const NewPage = lazy(() => import('../pages/NewPage'));
```

### Step 4: Add the New Route

#### For Public Routes

Add the new route to the routes array in the Router component. For example, to add a public route:

```jsx
{
    path: 'new',
    element: (
        <PreAuthTemplate>
            <Suspense fallback={<Loader />}>
                <NewPage />
            </Suspense>
        </PreAuthTemplate>
    ),
},
```

#### For Protected Routes

If the route should be protected, add it under the children array of the PostAuthTemplate. Use the PrivateRoute component to restrict access:

```jsx
{
    path: 'new',
    element: <PrivateRoute element={<NewPage />} roles={['USER', 'ADMIN']} />,
},
```

## Page Templates

#### PreAuth Pages

For routes that do not require authentication, such as the home page, login, or registration, wrap the route element with PreAuthTemplate:
```js
{
    path: 'login',
    element: (
        <PreAuthTemplate>
            <Suspense fallback={<Loader />}>
                <LoginPage />
            </Suspense>
        </PreAuthTemplate>
    ),
}
```

#### PostAuth Routes

For authenticated routes, you only need to add your route to the children array under the PostAuthTemplate. Use the children array to define specific authenticated routes.

```js
{
    element: (
        <PostAuthTemplate>
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
        </PostAuthTemplate>
    ),
    children: [
        {
            path: 'dashboard',
            element: <PrivateRoute element={<Dashboard />} roles={['USER']} />,
        },
    ],
}
```