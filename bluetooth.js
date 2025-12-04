class ArduinoBluetoothHandler {
    constructor() {
        this.ws = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.ws = new WebSocket("ws://localhost:8080");

            this.ws.onopen = () => {
                console.log("🌐 Connected to Bridge");
                this.isConnected = true;
            };

            this.ws.onmessage = (event) => {
                console.log("📨 Data Received:", event.data);

                try {
                    const readings = this.parseArduinoData(event.data);
                    if (readings) {
                        this.updateFormWithData(readings);
                        const ev = new CustomEvent("arduinoDataReceived", { detail: readings });
                        document.dispatchEvent(ev);
                    }
                } catch (e) {
                    console.error("Parse Error:", e);
                }
            };

            this.ws.onclose = () => {
                console.log("⚠️ Bridge Disconnected");
                this.isConnected = false;
            };

            return true;
        } catch (err) {
            console.error("❌ Error connecting to bridge", err);
            return false;
        }
    }

    // نفس وظائف التحليل المعروفة
    parseArduinoData(raw) {
        const obj = {};
        const parts = raw.split(",");
        parts.forEach(p => {
            const [key, val] = p.split(":");
            if (key && val) obj[key.trim().toUpperCase()] = parseFloat(val);
        });
        return obj;
    }

    updateFormWithData(data) {
        const map = {
            TEMP: "temp",
            MOISTURE: "moisture",
            PH: "ph",
            N: "n",
            P: "p",
            K: "k"
        };

        Object.keys(map).forEach((key) => {
            if (data[key] !== undefined) {
                const elm = document.getElementById(map[key]);
                elm.value = data[key];
                elm.style.background = "#c6f6d5";
                setTimeout(() => elm.style.background = "", 500);
            }
        });
    }
}

let bluetoothHandler = new ArduinoBluetoothHandler();
document.getElementById("connect-arduino-btn")?.addEventListener("click", async () => {
    try {
        console.log("🔍 Trying to connect to Arduino...");
        const ok = await bluetoothHandler.connect();
        
        if (ok) {
            alert("✅ Connected to Arduino!");
        } else {
            alert("❌ Failed to connect.");
        }
    } catch (err) {
        console.log("Bluetooth error:", err);
        alert("❌ Error connecting to Arduino");
    }
});
