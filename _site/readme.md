# DfE Design
This site documents the Design principles, standards and guidance that we expect teams working
within the [Department for Education (DfE)](https://www.gov.uk/government/organisations/department-for-education)
to follow when designing services.

It complements the [GDS Service Manual](https://www.gov.uk/service-manual) and its
[design section](https://www.gov.uk/service-manual/design),
which covers service design more broadly.

## Before you start

You can fork the repo to your personal github account, or download it to you machine. Once the code is in the right folder you have to check whether you have several dependencies.

## Dependencies

- Check if you have Ruby installed in your machine by running the following command on to a terminal:

```
ruby -v
```

You will need a minimum version of 2.6.3p62 to run this with no errors, if by default you have a Ruby vesrion lower than this, you can use a Ruby version manager such as [rvm](http://rvm.io/)

- Check if you have bundler by running the following command on to a terminal:

```
bundler -v
```

You will need the latest version that at the time of this being written is 2.2.24, if you don't have Bundler installed the terminal should prompt you to install one, via [homebrew](https://brew.sh/) 

##  Install locally

Once all the above have downloaded or are already on your machine simply run the following commands in the same folder where your project exists:

```
bundle install
```

When that process is finished run:

```
bundle exec jekyll serve
```

This should build a _site subfolder onto you project and serve the site locally at: [LocalHost](http://127.0.0.1:4000/) for you to make changes before pushing to the repo.

For contributing to this project please read the [contribude.md](/contribute.md) 