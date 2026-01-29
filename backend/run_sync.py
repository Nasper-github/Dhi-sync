import os
import sys
import uvicorn
from dotenv import load_dotenv

# 1. Pathing: Ensure the 'backend' directory is in the python path
# This script is at /workspaces/Dhi-sync/backend/run_sync.py
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# 2. Environment: Load the .env from the root workspace folder
# Root is one level up from /backend (/workspaces/Dhi-sync/.env)
root_dotenv = os.path.join(backend_dir, "..", ".env")
if os.path.exists(root_dotenv):
    load_dotenv(root_dotenv)
    print(f"✅ Loaded environment from: {root_dotenv}")
else:
    # Fallback to local directory
    load_dotenv()

if __name__ == "__main__":
    # Diagnostic check for the key used by the Canvas service
    api_key = os.getenv("GOOGLE_API_KEY")
    
    print("\n" + "="*50)
    print("🚀 SYNC INTELLIGENCE CORE: INITIATING...")
    print("="*50)
    print(f"📂 Root Directory: {backend_dir}")
    print(f"🔑 GOOGLE_API_KEY: {'✅ DETECTED' if api_key else '❌ NOT FOUND'}")
    print("📍 Surgical Gateway: http://0.0.0.0:8000")
    print("🧠 Mode: Symbolic Skeleton Deconstruction")
    print("="*50 + "\n")
    
    try:
        # Binding to 0.0.0.0 is mandatory for Codespace port exposure
        # 'reload=True' enables hot-reloading when you edit the Brain logic
        uvicorn.run(
            "app.main:app", 
            host="0.0.0.0", 
            port=8000, 
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ CRITICAL STARTUP ERROR: {e}")