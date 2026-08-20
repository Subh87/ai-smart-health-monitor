# Hardware Wiring & Specifications - AI Smart Health Monitor

## Hardware Requirements

| Component | Description | Interface / Pin |
|---|---|---|
| **ESP32 NodeMCU Development Board** | Main Wi-Fi / Microcontroller | Wi-Fi 802.11 b/g/n, Dual Core 240MHz |
| **MAX30102 Sensor Breakout** | Pulse Oximeter & Heart Rate Sensor | I2C (SDA = GPIO 21, SCL = GPIO 22) |
| **DS18B20 Digital Thermometer** | Stainless Probe Body Temperature Sensor | OneWire (DATA = GPIO 4) |
| **0.96" SSD1306 OLED Display** | 128x64 Monochrome Graphic Screen | I2C (SDA = GPIO 21, SCL = GPIO 22) |
| **4.7kΩ Resistor** | Pull-up Resistor for OneWire Data Bus | Between GPIO 4 (DATA) and 3.3V |
| **Breadboard & Jumper Wires** | Prototyping Interconnects | Male-to-Female & Male-to-Male |

---

## Wiring Pinout Table

### 1. MAX30102 Pulse Oximeter & Heart Rate Module
| MAX30102 Pin | ESP32 Pin | Wire / Note |
|---|---|---|
| **VCC** | **3.3V** | Operating Voltage (3.3V) |
| **GND** | **GND** | Common Ground |
| **SDA** | **GPIO 21** | I2C Data Line (Shared with OLED) |
| **SCL** | **GPIO 22** | I2C Clock Line (Shared with OLED) |

### 2. SSD1306 0.96" OLED Display (128x64)
| OLED Pin | ESP32 Pin | Wire / Note |
|---|---|---|
| **VCC** | **3.3V** | Operating Voltage (3.3V) |
| **GND** | **GND** | Common Ground |
| **SDA** | **GPIO 21** | I2C Data Line (Address 0x3C) |
| **SCL** | **GPIO 22** | I2C Clock Line |

### 3. DS18B20 Temperature Sensor
| DS18B20 Pin | ESP32 Pin | Wire / Note |
|---|---|---|
| **VCC (Red)** | **3.3V** | Operating Power |
| **GND (Black)** | **GND** | Ground |
| **DATA (Yellow/White)** | **GPIO 4** | OneWire Protocol |
| **Pull-up Resistor** | **4.7kΩ** | Connect resistor between **DATA (GPIO 4)** and **3.3V** |

---

## Schematic Connection Diagram

```
                 +-----------------------+
                 |       ESP32           |
                 |                       |
   3.3V ---------+--- 3.3V               |
   GND  ---------+--- GND                |
                 |                       |
                 |   GPIO 21 (SDA) ------+-------> MAX30102 SDA & OLED SDA
                 |   GPIO 22 (SCL) ------+-------> MAX30102 SCL & OLED SCL
                 |                       |
                 |   GPIO 4  (DATA) -----+-------> DS18B20 DATA Pin
                 +-----------------------+              |
                                                        +----[ 4.7kΩ Resistor ]---- 3.3V
```

---

## Troubleshooting & Hardware Testing Notes
- **I2C Bus Address Collision**: SSD1306 uses `0x3C` or `0x3D`. MAX30102 uses `0x57`. Both can share GPIO 21/22 without conflict.
- **Finger Placement on MAX30102**: Apply light, steady pressure on the red LED optical sensor. Excessive squeezing restricts peripheral capillary blood flow and leads to inaccurate readings.
- **DS18B20 Data Reliability**: If temperature reads `-127°C`, verify the 4.7kΩ resistor is securely connected between GPIO 4 and 3.3V.
