defmodule Server.StandupChannel do
  use Server.Web, :channel

  @doc """
  Allows a client to join the channel "standup".
  """
  def join("standup", _, socket) do
    {:ok, socket}
  end

  @doc """
  Let all connected clients know when a client has started the
  standup timer, passed to the next startup and so on.
  """
  def handle_in("shout", %{"action" => action}, socket) do
    broadcast(socket, "shout", %{"action" => action})
    {:noreply, socket}
  end
end
