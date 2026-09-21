# APEx STAC Browser

This repository contains APEx customisations for the
[STAC Browser](https://github.com/radiantearth/stac-browser), a graphical interface for browsing STAC catalogues. It is
not a standalone fork: a build clones the selected upstream STAC Browser version and overlays a theme directory from
this repository onto its root before creating a Docker image.

## Prerequisites

The build and local-development workflows require:

- Git
- Docker, with the daemon running
- `curl` (used when no STAC Browser version is supplied)
- Node.js and the package manager required by the checked-out upstream STAC Browser version for local development

## Repository layout

Each directory under `themes/` is an overlay for the upstream repository. Its files must use the same paths they have in
the upstream STAC Browser checkout. For example, `themes/apex/src/theme/custom.scss` replaces
`src/theme/custom.scss` in the upstream project during a build.

The `themes/<theme>/version.txt` file records the upstream version the theme was last developed against. Use that tag
when building or checking out the upstream source so that the files and configuration match.

### Why versioning matters

Each theme is coupled to the structure, dependencies, and theming APIs of a specific STAC Browser release. Upstream
releases can rename or remove files, alter configuration options, and change component or styling behaviour. Developing
against one version but building against another can therefore cause customisations to be skipped, the application to
fail to build, or the browser to behave differently from local testing.

Treat `themes/<theme>/version.txt` as the theme's compatibility version: use it for local development and production
builds, and change it only after testing the theme against the new upstream tag.

## Local development

Develop themes in a local checkout of the original STAC Browser repository. This gives access to its development server,
dependencies, and the complete source tree; this repository should contain only files that differ from upstream.

1. Choose a theme and read the `base_version` from `build_<theme>.yaml`; for example, the `apex` theme currently uses `v4.0.0`.
2. Clone the upstream repository at that exact tag:

  ```bash
  git clone --branch v4.0.0 --depth 1 https://github.com/radiantearth/stac-browser.git stac-browser
  cd stac-browser
  ```

3. Copy the theme overlay into the checkout. Run this from the root of this repository, adjusting the destination path
  to your checkout:

  ```bash
  cp -R themes/apex/. ../stac-browser/
  ```

4. Install dependencies and start the development server using the commands documented by the upstream
  [STAC Browser development guide](https://github.com/radiantearth/stac-browser). Make and test theme changes in that
  checkout.
5. Copy only the changed or added theme files back into the matching paths under `themes/apex/` in this repository.
  Do not copy dependency directories, build output, or unmodified upstream files. Review the result with
  `git diff` before committing.

When updating to a newer upstream STAC Browser release, repeat the workflow against the new tag, resolve any changes
needed by the theme, update `themes/<theme>/version.txt`, and build with that version to verify the overlay.

## Creating a new theme

1. Create a directory under `themes/`, for example `themes/my-theme/`.
2. Add only files that differ from upstream, preserving their upstream paths.
3. Add `themes/my-theme/version.txt` containing the upstream STAC Browser tag the theme targets.
4. Use the local-development workflow above to develop and test the theme.

### Setting up a build pipeline

To create an automated build for your new theme, you can copy the existing `.github/workflows/build_apex.yml` file and 
modify the following fields:

* `paths`: This should point to your new theme to ensure that a new build is triggered only when changes are made to your theme.
* `theme`: This should contain the name of your theme.

By doing this, a new Docker image will be built every time a change is made to the corresponding theme.


## Building the Docker image

Follow these steps to build a new Docker image with your custom theme:

Run the following command from the repository root to clone the upstream source, apply the theme overlay, and build the
Docker image:

```bash
sh scripts/build.sh <THEME> <VERSION>
```

| Parameter | Description |
|-----------|-------------|
| THEME | Name of the theme directory under `themes/`, for example `apex`. |
| VERSION | Optional upstream STAC Browser Git tag. Omit it to use the latest upstream tag. Prefer the version recorded in the theme's `version.txt` for reproducible builds. |

For example, build the APEx theme against its recorded upstream version:

```bash
sh scripts/build.sh apex 4.1.5
```

The image is tagged as `apex-<THEME>-stac-browser`; the preceding command produces
`apex-apex-stac-browser`.

## Running the webserver

```bash
docker run --rm -p 8080:8080 \
  -e SB_catalogUrl=<CATALOGUE_URL> \
  -e SB_catalogTitle=<TITLE> \
  --name apex-stac-browser apex-<THEME>-stac-browser
```

| Parameter     | Description                                             |
|---------------|---------------------------------------------------------|
| CATALOGUE URL | HTTPS URL of STAC catalogue to visualize in the browser | 
| TITLE         | Name of the catalogue to show in the browser            |

Example:
```bash
docker run --rm -p 8080:8080 \
  -e SB_catalogUrl="https://catalogue.demo.apex.esa.int/" \
  -e SB_catalogTitle="Test Catalogue" \
  --name apex-stac-browser apex-project-stac-browser
```

More information and additional parameters are available on
the [STAC browser](https://github.com/radiantearth/stac-browser) page.