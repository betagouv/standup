use Mix.Config

# Configures the endpoint
config :server, Server.Endpoint,
  url: [host: "localhost"],
  secret_key_base: (System.get_env("SECRET_KEY_BASE") || "asdf1234"),
  pubsub: [name: Server.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config.
import_config "#{Mix.env}.exs"
