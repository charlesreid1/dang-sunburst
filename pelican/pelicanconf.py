#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals
import re
import os


SITEURL = ''
AUTHOR = u'charlesreid1'
SITENAME = u'dang-sunburst'
SITEURL = '/dang-sunburst'

PATH = 'content'
TIMEZONE = 'America/Los_Angeles'
DEFAULT_LANG = u'en'

# the theme 
THEME = 'simple-angular'

# template locations 
EXTRA_TEMPLATES_PATHS = ['angular',
                         'angular/letters',
                         'angular/breakdown',
                         'angular/dynamic']

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


# breakdown

# orthog
TEMPLATE_PAGES['orthog_tree.json']     = 'breakdown/orthog_tree.json'

TEMPLATE_PAGES['orthog.html']          = 'breakdown/orthog.html'
TEMPLATE_PAGES['orthog.css']           = 'breakdown/orthog.css'
TEMPLATE_PAGES['orthog_modcontrol.js'] = 'breakdown/orthog_modcontrol.js'
TEMPLATE_PAGES['orthog_sunburst.js']   = 'breakdown/orthog_sunburst.js'

# nest
TEMPLATE_PAGES['nest_tree.json']       = 'breakdown/nest_tree.json'

TEMPLATE_PAGES['nest.html']            = 'breakdown/nest.html'
TEMPLATE_PAGES['nest.css']             = 'breakdown/nest.css'
TEMPLATE_PAGES['nest_modcontrol.js']   = 'breakdown/nest_modcontrol.js'
TEMPLATE_PAGES['nest_sunburst.js']     = 'breakdown/nest_sunburst.js'

TEMPLATE_PAGES['nestorthog.html']      = 'breakdown/nestorthog.html'


# dynamic

# slider
TEMPLATE_PAGES['slider_tree.json']      = 'dynamic/slider_tree.json'

TEMPLATE_PAGES['slider.html']           = 'dynamic/slider.html'
TEMPLATE_PAGES['slider.css']            = 'dynamic/slider.css'
TEMPLATE_PAGES['slider.md']             = 'dynamic/slider.md'

TEMPLATE_PAGES['slider_modcontrol.js']  = 'dynamic/slider_modcontrol.js'
TEMPLATE_PAGES['slider_sunburst.js']    = 'dynamic/slider_sunburst.js'

# pushpop
TEMPLATE_PAGES['pushpop_tree.json']      = 'dynamic/pushpop_tree.json'

TEMPLATE_PAGES['pushpop.html']           = 'dynamic/pushpop.html'
TEMPLATE_PAGES['pushpop.css']            = 'dynamic/pushpop.css'
TEMPLATE_PAGES['pushpop.md']             = 'dynamic/pushpop.md'

TEMPLATE_PAGES['pushpop_modcontrol.js']  = 'dynamic/pushpop_modcontrol.js'
TEMPLATE_PAGES['pushpop_sunburst.js']    = 'dynamic/pushpop_sunburst.js'





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
