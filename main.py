#!/usr/bin/env python

import datetime
import json
import logging
import re

from google.appengine.api import memcache, urlfetch

import webapp2


class Handler(webapp2.RequestHandler):
    def get_current_meteosat(self, name):
        """Download current Meteosat 0 full disc view."""
        try:
            result = urlfetch.fetch('http://oiswww.eumetsat.org/IPPS/html/' + name + '/RGB/NATURALCOLOR/FULLRESOLUTION/')
            if result.status_code == 200:
                image_url = ('http://oiswww.eumetsat.org/IPPS/html/' + name + '/RGB/NATURALCOLOR/FULLRESOLUTION/IMAGESDisplay/') + re.search(r'array_nom_imagen\[0\]="(\w*)"', result.content).group(1)
                date_string = re.search(r'\<option value="0"\>(.*)\<\/option\>', result.content).group(1)
                # 19/06/18 15:00 UTC  -> 2018-06-19 15:00:00
                date = datetime.datetime.strptime(date_string, "%d/%m/%y %H:%M UTC").strftime('%Y-%m-%d %H:%M:%S')

                return {
                    'url': image_url,
                    'date': date
                }
            else:
                self.response.status_code = result.status_code
        except urlfetch.Error:
            logging.exception('Caught exception fetching url')

    def get_with_name(self, name):
        data = memcache.get(name)
        if data is None:
            data = json.dumps(self.get_current_meteosat(name))
            memcache.add(name, data, 120)

        self.response.headers['Content-Type'] = 'text/json'
        self.response.write(data)

class MSGIODCHandler(Handler):
    ''' At 41.5 Degree '''
    def get(self):
        return self.get_with_name('MSGIODC')


class MSGHandler(Handler):
    ''' At 0 Degree '''
    def get(self):
        return self.get_with_name('MSG')

app = webapp2.WSGIApplication([
    ('/msgiodc', MSGIODCHandler),
    ('/msg', MSGHandler),
], debug=True)
