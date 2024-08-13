# APEx STAC Browser

This repository demonstrates how to set up a STAC browser with custom theming tailored to the APEx branding. The browser
is built on an existing [open-source repository](https://github.com/radiantearth/stac-browser) that provides a graphical
user interface for navigating an existing STAC catalog. For the APEx deployment, we've applied a custom theme to
personalize the browser's appearance and user experience.

## Creating a new theme

To create a new theme, we recommend following
the [theming guide](https://github.com/radiantearth/stac-browser?tab=readme-ov-file#themes) by cloning and running the
code from original repository. Once you've created the new theme locally, you can proceed to the next step, where we'll
build the Docker image.

## Building the Docker Image

Follow these steps to build a new Docker image with your custom theme:

1. Create a new folder in the `themes` directory of this repository.
2. Copy the files that need to be overwritten to apply your theme to the original STAC browser code. Be sure to maintain
   the same folder structure as the [base repository](https://github.com/radiantearth/stac-browser).
3. Run the following command to build the Docker container and apply your custom theme:

```bash
sh scripts/build.sh <theme> <version>
```

| Parameter | Description                                                                                                                    |
|-----------|--------------------------------------------------------------------------------------------------------------------------------|
| THEME     | Name of the theme that should be applied. This is the name of the folder in step 1.                                            | 
| VERSION   | (Optional) Version of the original STAC browser code to apply. If not specified, it will automatically use the latest version. |

# Running the webserver

```bash
docker run --rm -p 8080:8080 \
  -e SB_catalogUrl=<CATALOGUE_URL> \
  -e SB_catalogTitle=<TITLE> \
  --name apex-stac-browser apex-apex-stac-browser
```

| Parameter     | Description                                             |
|---------------|---------------------------------------------------------|
| CATALOGUE URL | HTTPS URL of STAC catalogue to visualize in the browser | 
| TITLE         | Name of the catalogue to show in the browser            |

More information and additional parameters are available on
the [STAC browser](https://github.com/radiantearth/stac-browser) page.