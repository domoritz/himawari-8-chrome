#!/usr/bin/env python

import logging
import re
import json
import datetime

from google.appengine.api import urlfetch

import webapp2


URL = 'http://oiswww.eumetsat.org/IPPS/html/MSGIODC/RGB/NATURALCOLOR/FULLRESOLUTION/'


class MainPage(webapp2.RequestHandler):
    def get_current_meteosat(self):
        """Download current Meteosat 0 full disc view."""
        try:
            result = urlfetch.fetch(URL)
            if result.status_code == 200:
                image_url = 'http://oiswww.eumetsat.org/IPPS/html/MSGIODC/RGB/NATURALCOLOR/FULLRESOLUTION/IMAGESDisplay/' + re.search(r'array_nom_imagen\[0\]="(\w*)"', result.content).group(1)
                date_string = re.search(r'\<option value="0"\>(.*)\<\/option\>').group(1)
                # 19/06/18 15:00 UTC
                date = datetime.datetime.strptime(date_string, "%d/%m/%y %H:%M UTC")

                return {
                    'url': image_url
                    'date': date
                }
            else:
                self.response.status_code = result.status_code
        except urlfetch.Error:
            logging.exception('Caught exception fetching url')

    def get(self):
        self.response.headers['Content-Type'] = 'text/json'
        self.response.write(json.dumps(self.get_current_meteosat()))

app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
