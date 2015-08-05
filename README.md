# zipcode-rack

Rack API to find city data by zip code and name.

## Usage

Mount as a rack app, either in Rails's routes or in `config.ru`. Require data
gem separately (see [zipcode-db](https://github.com/lloeki/zipcode-db)).

See rack tests to get some idea of API calls.

Depending on the data source, some extra fields may be provided.

## License

MIT
