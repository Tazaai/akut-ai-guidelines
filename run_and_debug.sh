#!/bin/bash
set -x # Enable debugging output
echo "Starting run_and_debug.sh"
echo "Current directory: $(pwd)"

# Script to find, start, and stop a React app, capturing its console output.

# 1. Find the React app directory.
find_react_app() {
  if [ -f "./my-guideline-app/package.json" ] && [ -d "./my-guideline-app/public" ] && [ -f "./my-guideline-app/public/index.html" ]; then
    echo "./my-guideline-app"
    return 0
  elif [ -f "./my-guideline-app/package.json" ] && [ -f "./my-guideline-app/index.html" ]; then
    echo "./my-guideline-app"
    return 0
  else
    return 1
  fi
}

REACT_APP_DIR=$(find_react_app)

# 7. Handle the case where the React app directory is not found.
if [ -z "$REACT_APP_DIR" ]; then
  echo "Error: React app directory not found." >&2
  exit 1
fi

echo "React app directory found: $REACT_APP_DIR"

# 2. Navigate to the React app directory.
cd "$REACT_APP_DIR" || {
  echo "Error: Could not navigate to React app directory." >&2
  exit 1
}

# 3. Start the React app and capture console output.
echo "Starting React app..."
npm start > console_output.log 2>&1 &
REACT_PID=$!  # Store the process ID of the backgrounded npm start process.

# 4. Wait for 10 seconds.
echo "Waiting for 10 seconds..."
sleep 10

# 5. Stop the React app.
echo "Stopping React app..."
kill "$REACT_PID" 2>/dev/null || true # Try to gracefully kill the process. Suppress error if not found
wait "$REACT_PID" 2>/dev/null || true # Wait for it to finish (or fail)

# Check if process is still running and kill it forcefully if it is
if ps -p "$REACT_PID" > /dev/null; then
  echo "React app did not stop gracefully, killing forcefully..."
  kill -9 "$REACT_PID" 2>/dev/null || true
  wait "$REACT_PID" 2>/dev/null || true
fi

echo "React app stopped."

# 6. Output the contents of console_output.log.
echo "Console output:"
cat console_output.log

# 8. Check for "Step not found." error in the console output.
if grep -q "Step not found." console_output.log; then
  echo "Error: React app is encountering a 'Step not found.' error."
fi

# 9. Attempt to fix errors based on the console output (very basic example).
#   This is where you would add more sophisticated error handling and
#   potentially automated fixes based on common errors reported in the logs.
if grep -q "Failed to compile" console_output.log; then
  echo "Error: React app failed to compile.  Attempting a simple fix..."
  # Example fix:  If there's a known issue with node_modules, try deleting them.
  rm -rf node_modules
  npm install
  echo "Attempted to fix compilation errors by removing node_modules and reinstalling. Please rerun the script."
fi

echo "Script complete."

exit 0
