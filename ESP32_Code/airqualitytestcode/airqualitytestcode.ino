#include <Wire.h>    // I2C library
#include "ccs811.h"  // CCS811 library
#include <WiFi.h>
#include <HTTPClient.h>

CCS811 ccs811(23); // nWAKE on D3

#define MQ131_PIN 34 // GPIO pin where the sensor is connected
float slope = 0.4; // Example slope from your calibration
float intercept = -20; // Example intercept from your calibration

float val1, val2;

const char* ssid = "Dont try";  // Enter SSID here
const char* password = "himaNIni123@NIDHAL@";  // Enter Password here

const char* serverUrl = "http://192.168.1.14:5000/data";

void setup() {
  // Enable serial
  Serial.begin(115200);
  Serial.println("");
  Serial.println("setup: Starting CCS811 basic demo");
  Serial.print("setup: ccs811 lib version: ");
  Serial.println(CCS811_VERSION);

  // Enable I2C
  Wire.begin();

  // Enable CCS811
  ccs811.set_i2cdelay(50); // Needed for ESP8266 because it doesn't handle I2C clock stretch correctly
  bool ok = ccs811.begin();
  if (!ok) Serial.println("setup: CCS811 begin FAILED");

  // Print CCS811 versions
  Serial.print("setup: hardware version: "); Serial.println(ccs811.hardware_version(), HEX);
  Serial.print("setup: bootloader version: "); Serial.println(ccs811.bootloader_version(), HEX);
  Serial.print("setup: application version: "); Serial.println(ccs811.application_version(), HEX);

  // Start measuring
  ok = ccs811.start(CCS811_MODE_1SEC);
  if (!ok) Serial.println("setup: CCS811 start FAILED");

  Serial.println("Connecting to ");
  Serial.println(ssid);

  // Connect to your local Wi-Fi network
  WiFi.begin(ssid, password);

  // Check Wi-Fi connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected..!");
  Serial.print("Got IP: ");
  Serial.println(WiFi.localIP());

  pinMode(MQ131_PIN, INPUT); // Set the MQ131 pin as an input
}

void loop() {
  // Read
  uint16_t eco2, etvoc, errstat, raw;
  ccs811.read(&eco2, &etvoc, &errstat, &raw);

  // Print measurement results based on status
  if (errstat == CCS811_ERRSTAT_OK) {
    val1 = eco2;
    val2 = etvoc;

    Serial.print("CCS811: ");
    Serial.print("eco2=");
    Serial.print(val1);
    Serial.print(" ppm  ");

    Serial.print("etvoc=");
    Serial.print(val2);
    Serial.print(" ppb  ");
    Serial.println();
  } else if (errstat == CCS811_ERRSTAT_OK_NODATA) {
    Serial.println("CCS811: waiting for (new) data");
  } else if (errstat & CCS811_ERRSTAT_I2CFAIL) {
    Serial.println("CCS811: I2C error");
  } else {
    Serial.print("CCS811: errstat=");
    Serial.print(errstat, HEX);
    Serial.print("=");
    Serial.println(ccs811.errstat_str(errstat));
  }

  int adcValue = analogRead(MQ131_PIN); // Read the analog value from sensor
  float ozonePPB = adcValue * slope + intercept; // Convert ADC value to ppb using the calibration equation
  Serial.print("Ozone Concentration: ");
  Serial.print(ozonePPB);
  Serial.println(" ppb");

  // Send data to server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String postData = "eco2=" + String(val1) + "&etvoc=" + String(val2) + "&ozone=" + String(ozonePPB);

    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    int httpResponseCode = http.POST(postData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }

  // Wait
  delay(60000);
}
