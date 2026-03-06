// a dummy token for my another project totaly different from this one
// 2. Device Registration (POST API)
// Device sends a POST request to the server with:
// MAC ID (device identification)
// Wi-Fi signal strength (for debugging)
// SSID (for debugging)
// Timestamp (for debugging)
// Server stores this information and confirms the login/registration status.
/*
void process_json(const char* json) {
    LOG("\njson:\n%s\n", json);

    StaticJsonDocument<2048> doc;
    DeserializationError err = deserializeJson(doc, json);

    if (err) {
        LOG("JSON parse failed: %s", err.c_str());
        return;
    }

    if (!doc.containsKey("command")) {
        LOG("No command field in JSON");
        return;
    }

    const char* command = doc["command"];
    if (!command) {
        LOG("command is null");
        return;
    }

    LOG("command: %s", command);

    if (strcmp(command, "register") == 0) {
        LOG("Device registered successfully");
        device_state.counter_number = doc["counter_number"] | 0;

        for (int i = 1; i <= 10; i++) {
            showTokenShiftUI(i*10);
            delay(100);
        }

        showTokenInfoCard(device_state.token_number, device_state.counter_number);

    } else if (strcmp(command, "callnext") == 0) {

        device_state.token_number   = doc["token_number"] | 0;
        device_state.counter_number = doc["counter_number"] | 0;

        if(device_state.token_number == 0 && device_state.counter_number == 0){
            return;
        }

        LOG("next patient called");
        LOG("token and counter is : %d %d",
            device_state.token_number,
            device_state.counter_number);

        for (int i = 1; i <= 10; i++) {
            showTokenShiftUI(i*10);
            delay(100);
        }

        showTokenInfoCard(device_state.token_number, device_state.counter_number);

    } else if (strcmp(command, "recalltoken") == 0) {

        LOG("token recalled");
        LOG("token and counter is : %d %d",
            device_state.token_number,
            device_state.counter_number);

    }else if (strcmp(command, "startsession") == 0) {
        device_state.counter_number = doc["counter_number"] | 0;
        for (int i = 1; i <= 10; i++) {
            showTokenShiftUI(i*10);
            delay(100);
        }

        showTokenInfoCard(device_state.token_number, device_state.counter_number);

        LOG("consultation session started");

    } else if (strcmp(command, "stopsession") == 0) {

        LOG("consultation session stopped"); 
        session_ended();

    }
    else {
        LOG("unknown command: %s", command);
    }
}

String mac = WiFi.macAddress();
uint32_t currentToken = 0;

void registerDevice() {
    LOG("registering device");

    int8_t rssi = WiFi.RSSI();
    String ssid = WiFi.SSID();

    StaticJsonDocument<256> doc;

    doc["command"] = "register";
    doc["macId"] = mac;
    doc["Rssi"] = rssi;
    doc["ssid"] = ssid;

    char buffer[27];
    getCurrentDateTimeISO8601(buffer);

    doc["timestamp"] = buffer;

    char body[256];
    serializeJson(doc, body);

    LOG(body);

    sendHttpRequest(client,
                    device_essentials.API_HOST,
                    443,
                    "POST",
                    "/api/v1/users/register",
                    "application/json",
                    body);
}

//{ "command": "register", "mac": "mac", "rssi": "rssi", "ssid": "ssid", "timestamp": "timestamp" }

void callNextPatient() {

    StaticJsonDocument<128> doc;

    doc["command"] = "callnext";
    doc["currentToken"] = device_state.token_number;
    doc["macId"] = mac;

    char buffer[27];
    getCurrentDateTimeISO8601(buffer);

    doc["timestamp"] = buffer;

    char body[128];
    serializeJson(doc, body);

    LOG(body);

    sendHttpRequest(client,
                    device_essentials.API_HOST,
                    443,
                    "GET",
                    "/api/v1/users/callnext",
                    nullptr,
                    nullptr);
}

// { "command": "callnext", "currentToken": "currentToken", "mac": "mac", "timestamp": "timestamp" }

void recallToken() {

    StaticJsonDocument<128> doc;

    doc["command"] = "recalltoken";
    doc["currentToken"] = device_state.token_number;
    doc["macId"] = mac;

    char buffer[27];
    getCurrentDateTimeISO8601(buffer);

    doc["timestamp"] = buffer;

    char body[128];
    serializeJson(doc, body);

    LOG(body);

    sendHttpRequest(client,
                    device_essentials.API_HOST,
                    443,
                    "POST",
                    "/api/v1/users/recalltoken",
                    "application/json",
                    body);
}

void startConsultationSession() {

    StaticJsonDocument<256> doc;

    doc["command"] = "startsession";
    doc["macId"] = mac;

    char buffer[27];
    getCurrentDateTimeISO8601(buffer);

    doc["timestamp"] = buffer;

    char body[128];
    serializeJson(doc, body);

    LOG(body);

    sendHttpRequest(client,
                    device_essentials.API_HOST,
                    443,
                    "POST",
                    "/api/v1/users/startsession",
                    "application/json",
                    body);
}

void stopConsultationSession() {

    StaticJsonDocument<256> doc;

    doc["command"] = "stopsession";
    doc["macId"] = mac;

    char buffer[27];
    getCurrentDateTimeISO8601(buffer);

    doc["timestamp"] = buffer;

    char body[128];
    serializeJson(doc, body);

    LOG(body);

    sendHttpRequest(client,
                    device_essentials.API_HOST,
                    443,
                    "POST",
                    "/api/v1/users/stopsession",
                    "application/json",
                    body);
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

exports.startConsultationSession = async (req, res) => {
    console.log(req.body);
    try {
        res.status(200).json({ command : 'startsession', counter_number: counter_number, message: 'Session started successfully' });
    }
    catch (error) {
        res.status(500).json({ command : 'startsession', message: 'Server error' });
    }
};

exports.stopConsultationSession = async (req, res) => {
    console.log(req.body);
    try {
        res.status(200).json({ command : 'stopsession', message: 'Session stopped successfully' });
    }
    catch (error) {
        res.status(500).json({ command : 'stopsession', message: 'Server error' });
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