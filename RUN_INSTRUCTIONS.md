# How to Run the Startup Script

## Method 1: Double-Click (Easiest)
Just double-click `start-all-admin.bat` in File Explorer

## Method 2: Command Prompt (Recommended for Debugging)

### Step-by-Step:
1. **Open Command Prompt:**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter
   - OR search for "Command Prompt" in Start Menu

2. **Navigate to project folder:**
   ```
   cd /d D:\GiftOfGrace\giftofgrace
   ```

3. **Run the script:**
   ```
   start-all-admin.bat
   ```

### Quick Method:
1. Open File Explorer
2. Navigate to `D:\GiftOfGrace\giftofgrace`
3. Click in the address bar
4. Type `cmd` and press Enter
5. Type `start-all-admin.bat` and press Enter

## Method 3: PowerShell
1. Open PowerShell
2. Navigate to project:
   ```
   cd D:\GiftOfGrace\giftofgrace
   ```
3. Run:
   ```
   .\start-all-admin.bat
   ```

## What to Expect:
- The script will show progress messages
- It will open separate windows for each server
- The main window will stay open so you can see any errors
- Press any key at the end to close the main window (servers keep running)

## Troubleshooting:
If the script closes immediately:
- Run it from Command Prompt (not double-click) to see error messages
- Check that Python 3.10 is installed: `python --version`
- Check that Node.js is installed: `node --version`
- Make sure you're in the correct directory

