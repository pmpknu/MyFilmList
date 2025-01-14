# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

*Stay tuned...*

## [v0.1.0]

- Full back-end implementation of MyFilmList.

### Features

- **Feed Implementation**: Introduced a new `/feed` endpoint that aggregates user-specific content, enhancing user engagement with personalized recommendations.
- **Watchlists Recommendations**: Developed a watchlist recommendation system within `FeedQuery`, allowing users to discover relevant content based on their viewing history.
- **User Roles Management**: Implemented a comprehensive user roles management module, including a new `User RoleService` to facilitate role assignment and permissions.
- **Comment and Review Entities**: Added entities for `Comment` and `Review`, complete with services to handle CRUD operations and enhance user interaction with content.
- **Reporting System**: Introduced a `Report` entity and associated services that allow users to report inappropriate content, ensuring a safer community.
- **Watchlist Functionality**: Created a `Watchlist` entity with full CRUD capabilities, enabling users to curate and manage their favorite content.
- **Password Recovery**: Implemented a password recovery feature that allows users to reset their passwords securely via email.
- **Email Verification**: Added user email verification functionality to ensure account authenticity and improve security during user registration.
- **Improved Recommendation Algorithms**: Enhanced the recommendation function to consider additional factors like production country and average rating, providing more relevant suggestions to users.
- **Markdown Linter Workflow**: Set up a continuous integration workflow for markdown linting to maintain documentation quality across the project.

### Fixes

- **User  Roles Bugs**: Resolved issues related to user roles that prevented proper assignment and retrieval of permissions, ensuring correct access control.
- **Comment and Review Counter Fixes**: Fixed bugs that caused incorrect counting of comments and reviews, ensuring accurate display of user interactions.
- **Migration Version Errors**: Addressed a broken migration version issue, ensuring smooth database migrations without data loss.
- **Serialization Issues**: Corrected serialization problems across various entities, improving data integrity during API responses.
- **Watchlist Viewer Count**: Fixed a bug that incorrectly incremented viewer counts on private watchlists, ensuring accurate tracking of user engagement.

## No previous changelog history

Please see `git log`

[Unreleased]: https://github.com/maxbarsukov/MyFilmList/compare/v0.1.0...HEAD
[v0.1.0]: https://github.com/maxbarsukov/MyFilmList/compare/c48ace0b10fa9c39edef4e6cb5e7b04650148078...v0.1.0
