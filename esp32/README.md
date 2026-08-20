# ESP32 Firmware - AI Smart Health Monitor

This folder contains the complete, ready-to-flash Arduino firmware for the ESP32 microcontroller with MAX30102 PPG sensor, DS18B20 digital thermometer, and 0.96" SSD1306 OLED display.

## Pin Connections
- **MAX30102**: VCC -> 3.3V, GND -> GND, SDA -> GPIO 21, SCL -> GPIO 22
- **SSD1306 OLED**: VCC -> 3.3V, GND -> GND, SDA -> GPIO 21, SCL -> GPIO 22
- **DS18B20**: VCC -> 3.3V, GND -> GND, DATA -> GPIO 4 (with 4.7kΩ pull-up resistor to 3.3V)

## Required Arduino Libraries
1. `SparkFun MAX3010x Pulse and Proximity Sensor Library` by SparkFun
2. `OneWire` by Paul Stoffregen
3. `DallasTemperature` by Miles Burton
4. `Adafruit SSD1306` & `Adafruit GFX Library`
5. `ArduinoJson` by Benoit Blanchon

## Flashing Instructions
1. Open `esp32_smart_health_monitor.ino` in Arduino IDE.
2. Update Wi-Fi SSID, Password, and your local machine IP address for `serverUrl`.
3. Select Board: `ESP32 Dev Module`.
4. Upload firmware and open Serial Monitor at `115200` baud rate.
