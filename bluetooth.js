class ArduinoBluetoothHandler {
    constructor() {
        this.ws = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.ws = new WebSocket("ws://localhost:3000");

            this.ws.onopen = () => {
                console.log("🌐 Connected to Bridge");
                this.isConnected = true;
            };

            this.ws.onmessage = (event) => {
                console.log("📨 Data Received:", event.data);

                try {
                    const readings = this.parseArduinoData(event.data);
                    if (readings && Object.keys(readings).length > 0) {
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

    async disconnect() {
        if (this.ws) {
            this.ws.close();
            this.isConnected = false;
        }
    }

    static isSupported() {
        return typeof WebSocket !== 'undefined';
    }

    // Parse Arduino data in multiple formats
    parseArduinoData(raw) {
        const obj = {};
        
        // Try JSON format first (from Arduino)
        if (raw.trim().startsWith('{')) {
            try {
                const jsonData = JSON.parse(raw.trim());
                // Map Arduino JSON keys to standard keys
                if (jsonData.temperature !== undefined) obj.TEMP = jsonData.temperature;
                if (jsonData.temp !== undefined) obj.TEMP = jsonData.temp;
                if (jsonData.moisture !== undefined) obj.MOISTURE = jsonData.moisture;
                if (jsonData.pH !== undefined) obj.PH = jsonData.pH;
                if (jsonData.ph !== undefined) obj.PH = jsonData.ph;
                if (jsonData.nitrogen !== undefined) obj.N = jsonData.nitrogen;
                if (jsonData.n !== undefined) obj.N = jsonData.n;
                if (jsonData.phosphorus !== undefined) obj.P = jsonData.phosphorus;
                if (jsonData.p !== undefined) obj.P = jsonData.p;
                if (jsonData.potassium !== undefined) obj.K = jsonData.potassium;
                if (jsonData.k !== undefined) obj.K = jsonData.k;
                return obj;
            } catch (e) {
                console.log('JSON parse error, trying other formats');
            }
        }
        
        // Try key:value format (TEMP:22.5,MOISTURE:65,PH:6.5,N:75,P:60,K:70)
        const parts = raw.split(",");
        parts.forEach(p => {
            const [key, val] = p.split(":");
            if (key && val) obj[key.trim().toUpperCase()] = parseFloat(val);
        });
        return obj;
    }

    updateFormWithData(data) {
        const map = {
            TEMP: ["temp", "manualTemp"],
            TEMPERATURE: ["temp", "manualTemp"],
            MOISTURE: ["moisture", "manualMoisture"],
            PH: ["ph", "manualPh"],
            N: ["n", "manualN"],
            NITROGEN: ["n", "manualN"],
            P: ["p", "manualP"],
            PHOSPHORUS: ["p", "manualP"],
            K: ["k", "manualK"],
            POTASSIUM: ["k", "manualK"]
        };

        Object.keys(map).forEach((key) => {
            if (data[key] !== undefined && !isNaN(data[key])) {
                const fieldIds = map[key];
                fieldIds.forEach(fieldId => {
                    const elm = document.getElementById(fieldId);
                    if (elm) {
                        elm.value = data[key];
                        elm.style.background = "#c6f6d5";
                        elm.style.transition = "background 0.5s";
                        setTimeout(() => elm.style.background = "", 500);
                    }
                });
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
