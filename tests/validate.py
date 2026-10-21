#!/usr/bin/env python3
"""Dependency-free structural checks for the Gecha static page."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.references = []
        self.scripts = []
        self.images = []
        self.headings = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'img':
            self.images.append(a)
        if tag in ('a', 'script', 'link', 'img'):
            attr = {'a': 'href', 'script': 'src', 'link': 'href', 'img': 'src'}[tag]
            url = a.get(attr, '')
            if url:
                self.references.append(url)
        if tag in ('h1', 'h2', 'h3'):
            self.headings.append(tag)

html = (ROOT / 'index.html').read_text(encoding='utf-8')
p = PageParser()
p.feed(html)
assert p.headings.count('h1') == 1, 'Expected exactly one h1'
assert len(p.ids) == len(set(p.ids)), 'Duplicate HTML IDs'
assert len(p.images) >= 2, 'Expected capybara illustrations'
assert all(img.get('alt') for img in p.images), 'Every image needs informative alt text'
assert len([x for x in p.references if x.endswith('.js')]) >= 1, 'Missing script'
for url in p.references:
    if url.startswith('#'):
        assert url[1:] in p.ids, f'Broken anchor {url}'
        continue
    parsed = urlparse(url)
    if parsed.scheme or url.startswith('//') or parsed.path == '':
        continue
    path = ROOT / parsed.path
    assert path.is_file(), f'Missing asset: {url}'
print('OK: heading structure, unique IDs, image alt text, valid anchors and linked assets.')
