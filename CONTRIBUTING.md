# Contributing to Backend-TypeORM-Auth-Base

First off, thank you for considering contributing to Backend-TypeORM-Auth-Base! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps** or point out the part of Backend-TypeORM-Auth-Base which the suggestion is related to.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful** to most Backend-TypeORM-Auth-Base users.

### Pull Requests

The process described here has several goals:

- Maintain Backend-TypeORM-Auth-Base's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Backend-TypeORM-Auth-Base
- Enable a sustainable system for Backend-TypeORM-Auth-Base's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](.github/pull_request_template.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐧 `:penguin:` when fixing something on Linux
    * 🍎 `:apple:` when fixing something on macOS
    * 🏁 `:checkered_flag:` when fixing something on Windows
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies
    * 👕 `:shirt:` when removing linter warnings

### TypeScript Styleguide

All TypeScript code should adhere to the project's existing style:

* Use 2 spaces for indentation
* Prefer `const` over `let` where possible
* Use meaningful variable and function names
* Add type annotations where TypeScript cannot infer types
* Use interfaces for object type definitions
* Follow existing patterns for error handling

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown/)
* Reference functions and classes in backticks: \`myFunction()\`
* Use [JSDoc](http://usejsdoc.org/) for code documentation

## Development Setup

1. Fork and clone the repo
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env` and configure your environment
4. Run `npm run dev` to start the development server
5. Make your changes
6. Run `npm run build` to test the build
7. Submit a pull request

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* `bug` - Issues that are bugs.
* `enhancement` - Issues that are feature requests.
* `documentation` - Issues or pull requests related to documentation.
* `good first issue` - Good for newcomers.
* `help wanted` - Extra attention is needed.
* `question` - Further information is requested.
