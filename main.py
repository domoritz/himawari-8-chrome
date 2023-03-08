#!/usr/bin/env python

import datetime
import logging
import json
import re
import requests

from flask import Flask, jsonify
from google.appengine.api import memcache, wrap_wsgi_app

app = Flask(__name__)
app.wsgi_app = wrap_wsgi_app(app.wsgi_app)

def get_current_meteosat(name):
    """Download current Meteosat full disc view."""
    product_page = 'https://eumetview.eumetsat.int/static-images/' + name + '/RGB/NATURALCOLORENHNCD/FULLRESOLUTION/'
    try:
        result = requests.get(product_page + 'index.htm')
        if result.status_code == 200:
            image_url = (product_page + 'IMAGESDisplay/') + re.search(r'array_nom_imagen\[0\]="(\w*)"', result.text).group(1)
            date_string = re.search(r'\<option value="0"\>(.*)\<\/option\>', result.text).group(1)
            # 19/06/18 15:00 UTC  -> 2018-06-19 15:00:00
            date = datetime.datetime.strptime(date_string, "%d/%m/%y %H:%M UTC").strftime('%Y-%m-%d %H:%M:%S')

            return {
                'url': image_url,
                'date': date
            }, 200
        else:
            return result.text, result.status_code
    except Exception:
        logging.exception('Caught exception fetching url')
        return 'Error', 500

def get_with_name(name):
    data = memcache.get(name)
    if data is None:
        data, code = get_current_meteosat(name)
        if code != 200:
            return data, code
        memcache.set(name, json.dumps(data), 120)
    else:
        data = json.loads(data)

    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/msgiodc')
def get_MSGIODC():
    ''' At 41.5 Degree '''
    return get_with_name('MSGIODC')

@app.route('/msg')
def get_MSG():
    ''' At 0 Degree '''
    return get_with_name('MSG')

if __name__ == "__main__":
    # Used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host="localhost", port=8080, debug=True)
