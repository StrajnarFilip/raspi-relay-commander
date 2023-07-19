from websocket import WebSocketApp, WebSocket
import rel
from json import dumps, loads

relay_state = [
    {
        "id": 1,
        "state": True
    },
    {
        "id": 2,
        "state": True
    },
    {
        "id": 3,
        "state": True
    },
    {
        "id": 4,
        "state": True
    },
    {
        "id": 5,
        "state": True
    },
    {
        "id": 6,
        "state": True
    },
]


def on_message(ws: WebSocket, message):
    global relay_state
    # If message is `u`, someone is asking for update of state:
    if message == "u":
        ws.send(dumps(relay_state))
        return

    # Otherwise, we assume they are sending a message to update
    # the state of relays in format of { "id": int, "state": bool }
    json_message = loads(message)

    for state in relay_state:
        # For element that matches ID from message,
        if state["id"] == json_message["id"]:
            # update the value of state
            state["state"] = json_message["state"]

    # Broadcast updated relay state
    ws.send(dumps(relay_state))


ws = WebSocketApp(
    "wss://api1.fprog.nl/t/fe439a8edfca7dcb6945b19cc5079c87/relays",
    on_message=on_message)
ws.run_forever(dispatcher=rel, reconnect=5)
rel.signal(2, rel.abort)  # Keyboard Interrupt
rel.dispatch()
