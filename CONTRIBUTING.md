# Contributing to the DfE Design manual

Thank you for your interest in contributing to the DfE Design manual project. This document outlines the processes and guidelines that help ensure successful contributions.

## Code of Conduct

Please review our [Code of Conduct](https://github.com/DFE-Digital/design?tab=coc-ov-file#) before contributing to uphold our community standards.

## Getting Started

To begin contributing, make sure your development environment is set up according to the instructions in the project's `README.md`.

## How to Contribute

### Reporting Bugs

To report a bug, use the [**bug report template**](https://github.com/DFE-Digital/design/blob/main/.github/ISSUE_TEMPLATE/bug_report.md) provided in the repository. Ensure you provide all the necessary details to help us understand and address the issue swiftly.

### Suggesting Enhancements

For new features or enhancements, please use the **Feature Request Template**. Detailed descriptions help us better evaluate and prioritize your suggestions.

### Making a Pull Request (PR)

#### Creating Your PR

**Create a New Branch**: From your local repository, create a new branch for your changes. Name your branch something descriptive, like `feature/add-new-design-component`.

`git checkout -b your-branch-name`

**Make Your Changes**: Implement the changes as intended. Be sure to adhere to the coding standards and guidelines outlined in the repository.

**Commit Your Changes**: Once your changes are ready, commit them to your branch.

`git add .`

`git commit -m "Add a descriptive commit message"`

**Push Your Branch**: Push the branch to the main repository.

**Open a Pull Request**:

- Navigate to the [main repository on GitHub](https://github.com/DFE-Digital/design). You should see a prompt to open a pull request from your newly pushed branch.
- Ensure the pull request details include:
  - **Associated Issue Numbers**: Link the issue numbers addressed by your PR.
  - **Assignee**: Set yourself or another relevant contributor as the assignee.
  - **Label**: Apply appropriate labels to categorize the PR (e.g., bug, enhancement).
  - **Project**: Allocate the PR to the "DfE Design" project.
- PRs must be reviewed by the code owner in DesignOps; assign the PR to `andyjones81`.

#### PR Review Process

Each PR will automatically create a review app in the Heroku pipeline for the design manual. This review app will be linked to your PR, and you must test your changes in this environment. The app will automatically be deleted after 5 days if no further changes are deployed.

#### PR Requirements

PRs that do not meet the following criteria will be rejected:

- Has no associated issue numbers in the details.
- Assignee is not set.
- Appropriate label is not set.
- Not allocated to the "DfE Design" project.

## Need Help?

If you need help with your contribution, please contact designops at [design.ops@education.gov.uk](mailto:design.ops@education.gov.uk).
