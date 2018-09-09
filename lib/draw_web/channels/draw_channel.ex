defmodule DrawWeb.DrawChannel do
  use Phoenix.Channel

  def join("draw", _message, socket) do
    {:ok, socket}
  end

  def handle_in("drawn", %{"body" => body}, socket) do
    broadcast! socket, "drawn", %{body: body}
    {:noreply, socket}
  end

end
