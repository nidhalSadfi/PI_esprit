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

const char* serverUrl = "http://192.168.1.14:5050/data";


void setup() {
  Serial.begin(115200);
  Serial.println("");
  Serial.println("setup: Starting CCS811 basic demo");
  Serial.print("setup: ccs811 lib version: ");
  Serial.println(CCS811_VERSION);

  Wire.begin();

  ccs811.set_i2cdelay(50);
  bool ok = ccs811.begin();
  if (!ok) Serial.println("setup: CCS811 begin FAILED");

  Serial.print("setup: hardware version: "); Serial.println(ccs811.hardware_version(), HEX);
  Serial.print("setup: bootloader version: "); Serial.println(ccs811.bootloader_version(), HEX);
  Serial.print("setup: application version: "); Serial.println(ccs811.application_version(), HEX);

  ok = ccs811.start(CCS811_MODE_1SEC);
  if (!ok) Serial.println("setup: CCS811 start FAILED");

  Serial.println("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected..!");
  Serial.print("Got IP: ");
  Serial.println(WiFi.localIP());

  pinMode(MQ131_PIN, INPUT);
}

void loop() {
  uint16_t eco2, etvoc, errstat, raw;
  ccs811.read(&eco2, &etvoc, &errstat, &raw);

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

  int adcValue = analogRead(MQ131_PIN);
  float ozonePPB = adcValue * slope + intercept;
  Serial.print("Ozone Concentration: ");
  Serial.print(ozonePPB);
  Serial.println(" ppb");

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String postData = "eco2=" + String(val1) + "&etvoc=" + String(val2) + "&ozone=" + String(ozonePPB);

    Serial.print("eco2: ");
    Serial.println(val1);
    Serial.print("etvoc: ");
    Serial.println(val2);
    Serial.print("ozone: ");
    Serial.println(ozonePPB);

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

  delay(60000);
}
