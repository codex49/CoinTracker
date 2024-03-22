// open dextools website and copy paste the code on chrome console
// this code will route the all incoming data from website to local websocket server


function wsRoute() {
    // Route dextool ws data to local server ws
    let subscribers = {}
    const client = new WebSocket("ws://localhost:8080");

    client.onopen = (event) => console.log("Server connection established.");

    client.onmessage = (event) => {
        const chains = JSON.parse(event.data);
        if (chains && Array.isArray(chains)) {
            // runs only once when local server send of chains
            chains.forEach(chain => {
                subscribers[chain] = new WebSocket("wss://ws.dextools.io/");
                subscribers[chain].onopen = (event) => {
                    console.log(`Dextool connection established for ${chain}`);
                    const data = { "params": { "chain": chain, "channel": chain != "ether" ? chain + ":pools" : "uni:pools" }, "id": 2, "jsonrpc": "2.0", "method": "subscribe" }
                    subscribers[chain].send(JSON.stringify(data));
                    subscribers[chain].onmessage = (event) => {
                        const pairEvent = JSON.parse(event.data);
                        client.send(JSON.stringify({ "data": { id: pairEvent.result?.data?.pair?.id, event: pairEvent.result?.data?.event }, "chain": chain, pairData: false }));
                    }

                }
            });
        } else if (chains && !Array.isArray(chains) && typeof chains === 'object') {
            setTimeout(async () => {
                try {
                    // runs to fetch, pair data
                    let resp = await fetch(chains.url);
                    let data = await resp.json();
                    client.send(JSON.stringify({ "data": data.data[0], "chain": chains.chain, pairData: true }));
                } catch (error) {
                    console.log(error)
                }
            }, 5000);
        }

    }

    client.onerror = (event) => {
        console.log("error")
        client.close();
        Object.values(subscribers).forEach(chain => chain.close())
    }

}

wsRoute()