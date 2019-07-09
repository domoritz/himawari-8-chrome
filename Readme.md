# meteosat-url

Access at https://meteosat-url.appspot.com/msg (at 0 degrees) and https://meteosat-url.appspot.com/msgiodc (at 41.5 degrees).

## Developers

Installation instructions at https://cloud.google.com/appengine/docs/standard/python/quickstart.

If you install google stuff via brew, you probably need to `export PATH="/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/bin:$PATH"`.

Run with `CLOUDSDK_PYTHON=/usr/bin/python dev_appserver.py app.yaml` if your default python is version 3.
