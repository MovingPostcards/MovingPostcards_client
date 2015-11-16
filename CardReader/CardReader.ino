// v: 0.0.1


#include <Wire.h>
#include <Adafruit_NFCShield_I2C.h>
#include <Arduino.h>

#define IRQ   (2)
#define RESET (3)  // Not connected by default on the NFC Shield

Adafruit_NFCShield_I2C nfc(IRQ, RESET);

static const unsigned long TIME_TO_WAIT = 3000;
unsigned long lastFoundUID = 0;
unsigned long lastTime;

//Convert Card ID from 4 bytes array format into unsigned long number format
unsigned long convertID(const uint8_t *byteArray, uint8_t uidLength)
{
    unsigned long result = byteArray[0];

    for (uint8_t i=1; i<uidLength; i++)
    {
        result = result * 256 + byteArray[i];
    }

    return result;
}

void setup() {
    Serial.begin(57600);

    nfc.begin();

    //Check if PN5 board is attached
    uint32_t versiondata = nfc.getFirmwareVersion();
    if (!versiondata) {
        //Serial.print("Didn't find PN53x board");
        while (1); // halt
    }

    //Serial.println("Found chip PN5");

    //Configure board to read RFID tags
    nfc.SAMConfig();

    //Serial.println("Waiting for ISO14443A Card ...");
}

void loop() { 
    uint8_t success;
    //Buffer to store the returned card UID
    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
    //Length of the UID (4 or 7 bytes depending on card type)
    uint8_t uidLength; 
    unsigned long longUID;
    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

    //If the 3 seconds are passed, reset the lastFoundID
    unsigned long currentTime = millis();
    if (currentTime - lastTime > TIME_TO_WAIT)
    {
        lastFoundUID = 0;
    }

    if (success) {
        longUID = convertID(uid, uidLength);
        
        //If a new card is detected, print its UID
        if (lastFoundUID != longUID) {
            //Serial.println("Found Card with ID: "); 
            //Serial.print(longUID);
            //Serial.println("");
            int valueToSend = (int)longUID;
            Serial.println(longUID);
            
            lastFoundUID = longUID;
            
            lastTime = currentTime;
        }
    }
}
