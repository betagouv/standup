defmodule Server.Endpoint do
  use Phoenix.Endpoint, otp_app: :server

  socket "/", Server.UserSocket

  plug Plug.RequestId
  plug Plug.Logger
  plug Plug.MethodOverride
  plug Plug.Head

  plug Server.Router
end
