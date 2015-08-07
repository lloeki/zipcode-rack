# zipcode-rack

Rack API to find city data by zip code and name.

[![Build Status](https://travis-ci.org/lloeki/zipcode-rack.svg?branch=master)](https://travis-ci.org/lloeki/zipcode-rack)

## Usage

Mount as a rack app, either in Rails's routes or in `config.ru`. Require data
gem separately (see [zipcode-db](https://github.com/lloeki/zipcode-db)).

See rack tests to get some idea of API calls.

Depending on the data source, some extra fields may be provided.

## Demo with UI

Once cloned, a demo is available locally by starting `rackup`, then navigate to
[/public/view.html](http://127.0.0.1:9292/public/view.html)

## Got Rails? Get the UI

Either `require 'zipcode/rails'` or `gem 'zipcode-rack', require:
'zipcode/rails'` will come in handy. Add `zipcode-input` to your manifest.

See [`public/view.html`](public/view.html) for an example of how to set things
up.

## License

MIT
