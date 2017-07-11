defmodule Server.StandupChannelTest do
  use Server.ChannelCase

  alias Server.StandupChannel

  setup do
    {:ok, _, socket} =
      socket("user_id", %{some: :assign})
      |> subscribe_and_join(StandupChannel, "standup")

    {:ok, socket: socket}
  end

  test "shout broadcasts to standup", %{socket: socket} do
    push(socket, "shout", %{"action" => "start"})
    assert_broadcast("shout", %{"action" => "start"})
  end

  test "broadcasts are pushed to the client", %{socket: socket} do
    broadcast_from!(socket, "broadcast", %{"action" => "next-startup"})
    assert_push("broadcast", %{"action" => "next-startup"})
  end
end
