#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals
import re
import os


SITEURL = ''
AUTHOR = u'charlesreid1'
SITENAME = u'dang-sunburst'
#SITEURL = '/dang-sunburst'

PATH = 'content'
TIMEZONE = 'America/Los_Angeles'
DEFAULT_LANG = u'en'

# the theme 
THEME = 'simple-angular'

# template locations 
EXTRA_TEMPLATES_PATHS = ['angular',
                         'angular/letters']

# template files 
TEMPLATE_PAGES = {}

# our custom index page
TEMPLATE_PAGES['index.html'] = 'index.html'

# hello angular world
TEMPLATE_PAGES['hello.html'] = 'hello/index.html'

# directives:
# letter frequencies
TEMPLATE_PAGES['letter_freq.json']      = 'letters/letter_freq.json'
TEMPLATE_PAGES['plain.html']            = 'letters/plain.html'
TEMPLATE_PAGES['plain_modcontrol.js']   = 'letters/plain_modcontrol.js'
TEMPLATE_PAGES['plain_sunburst.js']     = 'letters/plain_sunburst.js'

# bigrams
TEMPLATE_PAGES['bigrams.json']           = 'letters/bigrams.json'

TEMPLATE_PAGES['bigrams.html']           = 'letters/bigrams.html'
TEMPLATE_PAGES['bigrams_modcontrol.js']  = 'letters/bigrams_modcontrol.js'
TEMPLATE_PAGES['bigrams_sunburst.js']    = 'letters/bigrams_sunburst.js'

TEMPLATE_PAGES['bigrams2.html']          = 'letters/bigrams2.html'
TEMPLATE_PAGES['bigrams2.css']           = 'letters/bigrams2.css'
TEMPLATE_PAGES['bigrams2_modcontrol.js'] = 'letters/bigrams2_modcontrol.js'
TEMPLATE_PAGES['bigrams2_sunburst.js']   = 'letters/bigrams2_sunburst.js'







# --------------8<---------------------

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
