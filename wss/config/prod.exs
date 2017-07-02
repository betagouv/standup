use Mix.Config

config :server, Server.Endpoint,
  http: [port: {:system, "PORT"}],
  url: [host: "example.com", port: 80]

# Do not print debug messages in production
config :logger, level: :info
