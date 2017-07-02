defmodule Server.ChannelCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      use Phoenix.ChannelTest
      @endpoint Server.Endpoint
    end
  end

  setup tags do
    :ok
  end
end
