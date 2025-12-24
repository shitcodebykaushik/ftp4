export const defaultSketch = `// Arduino Sketch
// Welcome to the Arduino Simulator!

void setup() {
  // Initialize serial communication at 9600 baud
  Serial.begin(9600);
  
  // Initialize digital pin LED_BUILTIN as an output
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);  // Turn the LED on
  Serial.println("LED ON");
  delay(1000);                      // Wait for a second
  
  digitalWrite(LED_BUILTIN, LOW);   // Turn the LED off
  Serial.println("LED OFF");
  delay(1000);                      // Wait for a second
}
`;
