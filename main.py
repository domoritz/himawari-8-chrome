#!/usr/bin/env python3

from selenium import webdriver
import webapp2

URL = "http://oiswww.eumetsat.org/IPPS/html/MSG/RGB/NATURALCOLOR/FULLRESOLUTION/index.htm"

def get_current_meteosat():
    """Download current Meteosat 0 full disc view."""
    browser = webdriver.PhantomJS()
    browser.get(URL)
    img_element = browser.find_element_by_name("mainImage")
    img_url = img_element.get_attribute("src")
    browser.quit()
    return img_url


class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write(get_current_meteosat())


app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
