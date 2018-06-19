#!/usr/bin/env python

import logging
import re

from google.appengine.api import urlfetch

import webapp2


URL = "http://oiswww.eumetsat.org/IPPS/html/MSG/RGB/NATURALCOLOR/FULLRESOLUTION/"


class MainPage(webapp2.RequestHandler):
    def get_current_meteosat(self):
        """Download current Meteosat 0 full disc view."""
        try:
            result = urlfetch.fetch(URL)
            if result.status_code == 200:
                return re.search(r'array_nom_imagen\[0\]="(\w*)"', result.content).group(0)
            else:
                self.response.status_code = result.status_code
        except urlfetch.Error:
            logging.exception('Caught exception fetching url')

    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write("http://oiswww.eumetsat.org/IPPS/html/MSGIODC/RGB/NATURALCOLOR/FULLRESOLUTION/IMAGESDisplay/" + self.get_current_meteosat())

app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
