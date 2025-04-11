import time
import requests
import RPi.GPIO as GPIO

# Constants
parkingAreaId = "your_parking_area_id_here"
server_url = "http://localhost:5000/api/parking/autoLeave"

# Setup GPIO mode
GPIO.setmode(GPIO.BCM)

# Slot config (you can add more slots here if needed)
slots = {
    1: {"TRIG": 23, "ECHO": 24, "occupied": False, "start_time": None}
}

# Setup GPIO pins
for s in slots.values():
    GPIO.setup(s["TRIG"], GPIO.OUT)
    GPIO.setup(s["ECHO"], GPIO.IN)

# Function to get distance from sensor
def get_distance(TRIG, ECHO):
    GPIO.output(TRIG, False)
    time.sleep(0.05)

    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)

    pulse_start = time.time()
    timeout = pulse_start + 0.04

    while GPIO.input(ECHO) == 0 and time.time() < timeout:
        pulse_start = time.time()

    while GPIO.input(ECHO) == 1 and time.time() < timeout:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150  # Convert to cm
    return round(distance, 2)

# Send status to server only when vacant
def send_status(slot_id):
    data = {
        "parkingAreaId": parkingAreaId,
        "slot": slot_id,
        "state": "vacant"
    }
    try:
        response = requests.post(server_url, json=data)
        print(f"[SENT] Slot {slot_id} vacant. Server response: {response.json()}")
    except Exception as e:
        print(f"[ERROR] Could not send status for Slot {slot_id}: {e}")

# Main monitoring loop
try:
    print("🔍 Monitoring slots...")
    while True:
        for slot_id, s in slots.items():
            distance = get_distance(s["TRIG"], s["ECHO"])
            is_near = distance <= 10

            if is_near:
                if not s["occupied"]:
                    if s["start_time"] is None:
                        s["start_time"] = time.time()
                    elif time.time() - s["start_time"] >= 10:
                        s["occupied"] = True
                        print(f"🚗 Slot {slot_id} marked OCCUPIED (local only)")
            else:
                if s["occupied"]:
                    s["occupied"] = False
                    send_status(slot_id)
                    print(f"🅿️ Slot {slot_id} marked VACANT and reported")
                s["start_time"] = None

        time.sleep(1)

except KeyboardInterrupt:
    print("\n🛑 Monitoring stopped by user.")
    GPIO.cleanup()
