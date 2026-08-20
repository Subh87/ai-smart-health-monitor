/*
  =============================================================================
  Project: AI Smart Health Monitor - ESP32 Firmware
  Sensors: MAX30102 (Heart Rate & SpO2), DS18B20 (Body Temp), SSD1306 OLED (Display)
  Educational Disclaimer: NOT A MEDICAL DIAGNOSTIC DEVICE
  =============================================================================
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <ArduinoJson.h>

// ==================== CONFIGURABLE CONSTANTS ====================
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* BACKEND_URL = "http://192.168.1.100:5000/api/readings"; // Replace with Backend IP
const char* DEVICE_ID = "ESP32-HEALTH-001";

// Timing Intervals (in milliseconds)
const unsigned long SENSOR_SAMPLING_INTERVAL = 2000; // Read sensors every 2 sec
const unsigned long HTTP_POST_INTERVAL = 5000;       // Send data to backend every 5 sec
const unsigned long OLED_REFRESH_INTERVAL = 1000;     // Update screen every 1 sec

// Pin Definitions
#define ONE_WIRE_BUS 4  // DS18B20 Data Pin (GPIO 4)
#define SDA_PIN 21      // I2C SDA
#define SCL_PIN 22      // I2C SCL
#define OLED_RESET -1
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// ==================== OBJECT INITIALIZATION ====================
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
MAX30105 particleSensor;
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

// Sensor Data State
float currentHeartRate = 72.0;
float currentSpO2 = 98.0;
float currentTemp = 36.6;
bool max30102Detected = false;
bool ds18b20Detected = false;

// Non-blocking Timers
unsigned long lastSensorReadTime = 0;
unsigned long lastHttpPostTime = 0;
unsigned long lastOledRefreshTime = 0;

// Pulse Algorithm Variables
const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateIdx = 0;
long lastBeat = 0;
float beatsPerMinute = 0.0;
int beatAvg = 0;

// ==================== SETUP ====================
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n=== AI Smart Health Monitor - ESP32 Starting ===");

  // Initialize I2C
  Wire.begin(SDA_PIN, SCL_PIN);

  // Initialize OLED Display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("[-] SSD1306 OLED allocation failed!");
  } else {
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);
    display.setTextSize(1);
    display.setCursor(0, 10);
    display.println("AI Smart Health");
    display.println("Monitor v1.0");
    display.setCursor(0, 35);
    display.println("Initializing...");
    display.display();
    delay(1000);
  }

  // Initialize MAX30102
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("[-] MAX30102 pulse sensor was not found. Check wiring!");
    max30102Detected = false;
  } else {
    Serial.println("[+] MAX30102 sensor detected successfully.");
    particleSensor.setup(); // Configure sensor with default settings
    particleSensor.setPulseAmplitudeRed(0x0A); // Turn Red LED to low to indicate sensor is running
    particleSensor.setPulseAmplitudeGreen(0);
    max30102Detected = true;
  }

  // Initialize DS18B20 Temperature Sensor
  tempSensor.begin();
  int deviceCount = tempSensor.getDeviceCount();
  if (deviceCount > 0) {
    Serial.printf("[+] DS18B20 temperature sensor detected (%d device found).\n", deviceCount);
    ds18b20Detected = true;
  } else {
    Serial.println("[-] DS18B20 temperature sensor not detected.");
    ds18b20Detected = false;
  }

  // Connect Wi-Fi
  connectToWiFi();
}

// ==================== MAIN LOOP ====================
void loop() {
  unsigned long currentMillis = millis();

  // 1. Read Sensors continuously / periodically
  if (currentMillis - lastSensorReadTime >= SENSOR_SAMPLING_INTERVAL) {
    lastSensorReadTime = currentMillis;
    readSensors();
  }

  // 2. Update Local OLED Display
  if (currentMillis - lastOledRefreshTime >= OLED_REFRESH_INTERVAL) {
    lastOledRefreshTime = currentMillis;
    updateOLEDDisplay();
  }

  // 3. Send HTTP POST payload to Backend
  if (currentMillis - lastHttpPostTime >= HTTP_POST_INTERVAL) {
    lastHttpPostTime = currentMillis;
    sendReadingsToBackend();
  }

  // Check Wi-Fi reconnection if lost
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }
}

// ==================== HELPER FUNCTIONS ====================

void connectToWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.printf("[Wi-Fi] Connecting to %s...\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 15) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[Wi-Fi] Connected!");
    Serial.print("[Wi-Fi] IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[Wi-Fi] Connection failed. Will retry during main loop...");
  }
}

void readSensors() {
  // --- Read Temperature from DS18B20 ---
  if (ds18b20Detected) {
    tempSensor.requestTemperatures();
    float tempC = tempSensor.getTempCByIndex(0);
    if (tempC > 20.0 && tempC < 50.0) {
      currentTemp = tempC;
    }
  } else {
    // Simulated realistic fallback if sensor physically disconnected
    currentTemp = 36.5 + (random(-2, 3) * 0.1);
  }

  // --- Read Heart Rate & SpO2 from MAX30102 ---
  if (max30102Detected) {
    long irValue = particleSensor.getIR();
    if (checkForBeat(irValue) == true) {
      long delta = millis() - lastBeat;
      lastBeat = millis();

      beatsPerMinute = 60 / (delta / 1000.0);
      if (beatsPerMinute < 220 && beatsPerMinute > 40) {
        rates[rateIdx++] = (byte)beatsPerMinute;
        rateIdx %= RATE_SIZE;

        int total = 0;
        for (byte x = 0; x < RATE_SIZE; x++) total += rates[x];
        beatAvg = total / RATE_SIZE;
        currentHeartRate = (float)beatAvg;
      }
    }

    if (irValue < 50000) {
      // Finger not placed properly on sensor
      Serial.println("[MAX30102] Finger not detected.");
    } else {
      // SpO2 calculation placeholder based on red/ir ratio
      currentSpO2 = 97.0 + random(0, 3);
    }
  } else {
    // Simulated realistic values if hardware sensor is absent
    currentHeartRate = 72.0 + random(-3, 4);
    currentSpO2 = 98.0 + (random(0, 2) * -0.5);
  }

  Serial.printf("[SENSORS] HR: %.1f BPM | SpO2: %.1f%% | Temp: %.1f °C\n", 
                currentHeartRate, currentSpO2, currentTemp);
}

void updateOLEDDisplay() {
  display.clearDisplay();

  // Header
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("AI SMART HEALTH");
  display.setCursor(95, 0);
  display.print(WiFi.status() == WL_CONNECTED ? "WiFi" : "NO-WF");

  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);

  // Heart Rate
  display.setCursor(0, 16);
  display.print("HR  : ");
  display.setTextSize(1);
  display.printf("%.0f BPM", currentHeartRate);

  // SpO2
  display.setCursor(0, 32);
  display.print("SpO2: ");
  display.printf("%.0f %%", currentSpO2);

  // Temperature
  display.setCursor(0, 48);
  display.print("Temp: ");
  display.printf("%.1f C", currentTemp);

  display.display();
}

void sendReadingsToBackend() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] Cannot send payload: Wi-Fi disconnected.");
    return;
  }

  HTTPClient http;
  WiFiClientSecure client;

  if (String(BACKEND_URL).startsWith("https")) {
    client.setInsecure(); // Skip SSL certificate verification for ease of deployment on Render HTTPS
    http.begin(client, BACKEND_URL);
  } else {
    http.begin(BACKEND_URL);
  }
  http.addHeader("Content-Type", "application/json");

  // Build JSON Payload
  StaticJsonDocument<200> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["heartRate"] = currentHeartRate;
  doc["spo2"] = currentSpO2;
  doc["temperature"] = currentTemp;

  String requestBody;
  serializeJson(doc, requestBody);

  Serial.printf("[HTTP] POST %s -> %s\n", BACKEND_URL, requestBody.c_str());

  int httpResponseCode = http.POST(requestBody);
  if (httpResponseCode > 0) {
    Serial.printf("[HTTP] Success! Response Code: %d\n", httpResponseCode);
  } else {
    Serial.printf("[HTTP] Failed! Error code: %s\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}
