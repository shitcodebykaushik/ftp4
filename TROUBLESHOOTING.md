# Troubleshooting Guide

## Simulation Not Running

If the simulation isn't working, follow these steps:

### 1. Check Console Logs

Open your browser's Developer Tools (F12) and check the Console tab for error messages. You should see:

```
[Canvas] LED listener registered for pin 13
[Arduino] digitalWrite(13, 1) -> 1
[Arduino] Pin 13 changed to 1
[Canvas] Pin change event: pin=13, value=1
[Canvas] Setting LED to true
```

### 2. Verify Code is Valid

Make sure your Arduino code has proper `setup()` and `loop()` functions:

```cpp
void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LED ON");
  delay(1000);
  
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}
```

### 3. Check Serial Monitor

Click the **Run** button and watch the Serial Monitor at the bottom. You should see:

```
=== Simulation started ===
Serial communication started at 9600 baud
LED ON
LED OFF
LED ON
LED OFF
...
```

### 4. Clear Browser Cache

Sometimes cached files can cause issues:

1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 5. Restart Development Server

```bash
# Kill the server
pkill -f "next dev"

# Start again
npm run dev
```

## LED Not Blinking

### Check Pin Assignment

The default LED is connected to pin 13 (LED_BUILTIN). Make sure you're using the right pin:

```cpp
pinMode(LED_BUILTIN, OUTPUT);  // or pinMode(13, OUTPUT);
digitalWrite(LED_BUILTIN, HIGH);
```

### Check Component Properties

In the browser console, you can check the LED element:

```javascript
// Open console and type:
document.getElementById('led1')
// Should show the wokwi-led element
```

### Verify Pin Mode

Make sure you call `pinMode()` in `setup()`:

```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);  // This is required!
}
```

## Serial Monitor Not Showing Output

### Initialize Serial

Always call `Serial.begin()` in `setup()`:

```cpp
void setup() {
  Serial.begin(9600);
}
```

### Check Event Listeners

In the browser console:

```javascript
// Check if serial events are firing
window.addEventListener('arduino-serial', (e) => {
  console.log('Serial:', e.detail);
});
```

## Components Not Appearing

### Wokwi Elements Not Loaded

Check the console for errors like:

```
Failed to load Wokwi elements: ...
```

If you see this, try:

```bash
# Reinstall dependencies
npm install @wokwi/elements --force
```

### Canvas Container Issues

The canvas container needs proper sizing. Check the browser console:

```javascript
// Check canvas container
document.querySelector('[data-canvas-container]')
```

## Browser Compatibility

### Supported Browsers

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Web Components Support

Wokwi elements require Web Components support. If you're using an older browser, update it.

## Performance Issues

### Too Many Components

If the simulation is slow:

1. Reduce the delay in your loop (but not below 10ms)
2. Remove unused components
3. Simplify your circuit

### Memory Leaks

If the browser becomes unresponsive:

1. Click **Stop** button
2. Click **Reset** button
3. Refresh the page
4. Clear browser cache

## Common Errors

### "Cannot read property 'value' of undefined"

This means the LED element isn't found. Check:

1. LED element exists in the DOM
2. ID is correct ('led1')
3. Wokwi elements are loaded

### "pinMode is not defined"

The code extraction failed. Make sure:

1. Your code has proper `void setup()` and `void loop()` functions
2. Curly braces are balanced `{ }`
3. No extra characters outside functions

### "Simulation started but nothing happens"

Check that:

1. Your loop actually does something
2. `delay()` is called (otherwise loop runs too fast)
3. Serial monitor shows output

## Debug Mode

To enable detailed logging, open browser console and run:

```javascript
// Enable debug mode
localStorage.setItem('debug', 'true');

// Reload page
location.reload();
```

To disable:

```javascript
localStorage.removeItem('debug');
location.reload();
```

## Still Having Issues?

### Check These Files

1. **app/components/layout/SimulatorLayout.tsx** - Main simulation logic
2. **app/components/canvas/CircuitCanvas.tsx** - Component rendering
3. **lib/arduinoSimulator.ts** - Arduino simulation engine

### Console Commands for Testing

Open browser console and try these commands:

```javascript
// Test pin change event
window.dispatchEvent(new CustomEvent('arduino-pin-change', {
  detail: { pin: 13, value: 1 }
}));

// Test serial output
window.dispatchEvent(new CustomEvent('arduino-serial', {
  detail: { timestamp: Date.now(), message: 'Test message' }
}));

// Get simulator instance
// (Not directly accessible, but you can debug in handleRun function)
```

### Example Working Code

If nothing works, try this minimal example:

```cpp
void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
  Serial.println("Setup complete");
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("HIGH");
  delay(1000);
  
  digitalWrite(13, LOW);
  Serial.println("LOW");
  delay(1000);
}
```

## Tips

1. **Start Simple** - Test with the blink example first
2. **Check Console** - Always have Developer Tools open
3. **Use Serial** - Print debug messages to understand flow
4. **Stop Between Runs** - Click Stop before clicking Run again
5. **Reset if Stuck** - Use the Reset button to clear state

## Known Limitations

1. **No Wire Visuals** - Wires are logical only, not drawn
2. **Limited Functions** - Only basic Arduino functions supported
3. **No Interrupts** - `attachInterrupt()` not implemented
4. **No EEPROM** - No persistent storage
5. **No Advanced I/O** - No I2C, SPI, or Serial communication protocols

## Getting Help

If you're still stuck:

1. Check the browser console for errors
2. Look at the Network tab for loading issues
3. Try a different browser
4. Clear all cache and cookies
5. Reinstall dependencies: `rm -rf node_modules && npm install`
