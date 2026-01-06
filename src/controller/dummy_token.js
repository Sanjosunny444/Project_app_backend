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
    try {
        res.status(200).json({ message: 'Device registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

var token_number = 1;

exports.callNextPatient = async (req, res) => {
    token_number =token_number + 1;
    try {
        res.status(200).json({ message: 'Patient called successfully', token_number: token_number + 1 });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.recallToken = async (req, res) => {
    try {
        res.status(200).json({ message: 'Token recalled successfully', token_number: token_number});
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}