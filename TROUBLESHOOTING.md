# Admin Panel Troubleshooting

## "Failed to fetch" Error

If you're seeing "Failed to fetch" when trying to login:

### Step 1: Check if Admin API is Running
1. Look for a Command Prompt window titled "Admin API Server"
2. It should show something like:
   ```
   INFO:     Started server process
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://0.0.0.0:8001
   ```

### Step 2: Check for Errors in Admin API Window
- Look for any Python errors or import errors
- Common issues:
  - Missing dependencies: `pip install -r backend/admin_requirements.txt`
  - Port 8001 already in use
  - Python path issues

### Step 3: Verify API is Accessible
Open your browser and go to: `http://localhost:8001/docs`
- You should see the FastAPI documentation page
- If you get "This site can't be reached", the API isn't running

### Step 4: Manual API Test
Open browser console (F12) and run:
```javascript
fetch('http://localhost:8001/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'admin123' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

### Step 5: Restart Admin API
1. Close the "Admin API Server" window
2. Navigate to backend folder: `cd backend`
3. Activate venv: `venv\Scripts\activate`
4. Start API: `python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001 --reload`

### Common Fixes

**Issue: Port 8001 already in use**
- Solution: Kill the process using port 8001 or change the port in the script

**Issue: Missing FastAPI dependencies**
- Solution: `cd backend && venv\Scripts\activate && pip install -r admin_requirements.txt`

**Issue: CORS errors**
- Solution: Check that CORS is enabled in admin_api.py (should allow all origins in dev)

**Issue: Python path issues**
- Solution: Make sure you're using the venv Python, not system Python

