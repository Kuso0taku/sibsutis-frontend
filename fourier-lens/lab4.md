# Lab №4

## Task

**Modularity and handling all cases**

**Deadline:** 2 weeks from lecture 3.10

## Intro

By the time of this lab, you should already have chosen a project topic to develop during the remaining labs.

## Grades

### "Satisfactory"
- Project created via `npm create vite@latest`
- Project split into components
- `useState` hook is used in the project
- Props are used in the project

### "Good"
All conditions from ["Satisfactory"](#satisfactory) and:
- Implemented places where several components depend on one state
- Implemented mechanisms where a function that changes the parent state is passed in the child component's props

### "Excellent"
All conditions from ["Good"](#good) and:
- Aliases are configured in the project
- Implemented a hook (see React documentation for what a hook is) that uses `useState` internally (know the difference between a utility and a hook)
- Reviewed information about which components can be moved to the `shared` layer and moved the necessary components to this layer

## Additional

- If you know any other React hooks or concepts (but not third-party packages — state managers, cache managers, etc. should not be used yet) that have not been covered yet, you may use them in this lab, but be prepared to defend their use and explain usage patterns.
