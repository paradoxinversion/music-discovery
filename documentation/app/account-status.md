# Account Status

## User Statuses

### Pending

The `pending` status is for users that have signed up, but not yet authorized to sign in.

> During the early beta/mvp stage, there won't yet be a way for users to confirm their accounts via email/sms/etc, so users will be manually confirmed. Later in the beta/mvp stage, users will be automatically bumped from `pending` to `active` until a solution satisfies the needs of the platform.

### Active

The `active` status is for users that are signed up and have taken appropriate action to confirm their accounts. Active users are able to take the following actions:

- Sign In/Out
- Set Favorites
  - Artist Favorites
  - Track Favorites
- Update User Settings
  - Change email
  - Change Password
  - Delete User Account
- Access Artist Dashboard
  - Create Artists
  - Update Artists
  - Create Tracks
  - Update Tracks

### Inactive

The `inactive` status is for users that have elected to temporarily disable their accounts without completely deleting them.

- Sign In/Out
- Update User Settings
  - Delete User Account

### Banned

The `banned` status is for users that should no longer have access to the platform services. Banned users have extremely limited access.

- Sign In/Out
- Update User Settings
  - Change Password
  - Delete User Account
