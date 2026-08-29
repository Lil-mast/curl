"""API package marker.

Package-level helpers live in dedicated submodules so importing `services.api`
does not eagerly load the database layer.
"""