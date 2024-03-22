// open dextools website and copy paste the code on chrome console
// this code will make api call using browser api, and send data back to localserver via websocket


function wsRouteScraper() {
    const client = new WebSocket("ws://localhost:8080");

    client.onopen = (event) => console.log("Server connection established.");

    client.onmessage = async (event) => {
        const chains = JSON.parse(event.data);
        if (chains && Array.isArray(chains)) {
            chains.forEach(async (chain) => {
                const timestamp = Date.now() / 1000 | 0;
                let resp = await fetch(`https://www.dextools.io/chain-${chain != "ether" ? chain : "ethereum"}/api/generic/pools?timestampToShow=${timestamp}&range=1`);
                let data = await resp.json();
                //console.log(data)
                client.send(JSON.stringify({ "data": { pair_lists: data.data.creates, event: "pair_lists" }, "chain": chain, pairData: false }));
            });
        } else if (chains && !Array.isArray(chains) && typeof chains === 'object') {
            try {
                // runs to fetch, pair data
                let resp = await fetch(chains.url);
                let data = await resp.json();
                console.log(data)
                client.send(JSON.stringify({ "data": data.data[0], "chain": chains.chain, pairData: true, listScraper: true }));
            } catch (error) {
                console.log(error)
            }
        }
    }

    client.onerror = (event) => {
        client.close();
    }

}

wsRouteScraper()