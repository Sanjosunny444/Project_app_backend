// a dummy token for my another project totaly different from this one
// 2. Device Registration (POST API)
// Device sends a POST request to the server with:
// MAC ID (device identification)
// Wi-Fi signal strength (for debugging)
// SSID (for debugging)
// Timestamp (for debugging)
// Server stores this information and confirms the login/registration status.
/*
void registerDevice() {
    int8_t rssi = WiFi.RSSI();
    String ssid = WiFi.SSID();
    StaticJsonDocument<256> doc;
    doc["macId"] = mac;
    doc["Rssi"] = rssi;
    doc["ssid"] = ssid;
    char buffer[27];
    getCurrentDateTimeISO8601(buffer);
    doc["timestamp"] = buffer;
    char body[256];
    serializeJson(doc, body);
    sendHttpRequest(client, server_client, 443, "POST", "/api/register", "application/json", body);
}


void callNextPatient() {
    StaticJsonDocument<128> doc;
    doc["currentToken"] = currentToken;
    doc["macId"] = mac;
    char buffer[27];
    getCurrentDateTimeISO8601(buffer);
    doc["timestamp"] = buffer;

    char body[128];
    serializeJson(doc, body);
    sendHttpRequest(client, server_client, 443, "GET", "/api/call-next", nullptr, nullptr);
}

void recallToken() {
    StaticJsonDocument<128> doc;
    doc["currentToken"] = currentToken;
    doc["macId"] = mac;
    char buffer[27];
    getCurrentDateTimeISO8601(buffer);
    doc["timestamp"] = buffer;

    char body[128];
    serializeJson(doc, body);

    sendHttpRequest(client, server_client, 443, "POST", "/api/recall", "application/json", body);
}
*/
exports.registerDevice = async (req, res) => {
    console.log(req.body);
    try {
        res.status(200).json({ 
            command: "register",
            message: 'Device registered successfully',
            counter_number : counter_number
        });
    }
    catch (error) {
        res.status(500).json({ 
            command: "register",
            message: 'Server error' 
        });
    }
};

var token_number = 1;
const counter_number = 1;

exports.callNextPatient = async (req, res) => {
    console.log(req.body);
    token_number =token_number + 1;
    try {
        res.status(200).json({ command : 'callnext', message: 'Patient called successfully',
                             counter_number: counter_number, token_number: token_number + 1 });
    }
    catch (error) {
        res.status(500).json({ command : 'callnext', message: 'Server error' });
    }
};

exports.recallToken = async (req, res) => {
    console.log(req.body);
    try {
        res.status(200).json({ command : 'recalltoken', message: 'Token recalled successfully', token_number: token_number , counter_number: counter_number});
    }
    catch (error) {
        res.status(500).json({command : 'recalltoken', message: 'Server error' });
    }
}