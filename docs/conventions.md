1 : Each page component must have word Page ( pure server side component ) at its end and when we import a features component into that that feature component should not have that verb e.g. SignUpPage.tsx ( server side component ) imports from feature <------ feature/auth/ui/SignUp.tsx

2 : Auth verbs ( SignIn, SignUp, SignOut)

3 : all the inputs must have place holders as e.g. user@example.com instead of Enter your email

3 : verb verification will be used instead of approval 

4 : page and content of page ( main content of page )

## Server data cache

- Use `use cache` for responses that do not depend on the signed-in user, and
  `use cache: private` for responses scoped by user or role.
- Give each query a cache tag and invalidate that tag from successful actions
  that change its data.
- Refund-related cache invalidation happens when the refund action runs. The
  backend may finish its database updates asynchronously through the webhook;
  the existing `minutes` cache profile is retained, so webhook-driven changes
  may take time to appear without a webhook-to-Next.js callback.