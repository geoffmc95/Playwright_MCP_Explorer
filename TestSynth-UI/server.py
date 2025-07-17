#!/usr/bin/env python3
"""
Simple HTTP server for TestSynth UI
Serves static files without any dependencies
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

PORT = 3000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main():
    # Change to the directory containing this script
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    print(f"🎨 Starting TestSynth UI server...")
    print(f"📁 Serving files from: {script_dir}")
    print(f"🔗 Server will run on: http://localhost:{PORT}")
    print("")
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"✅ TestSynth UI running on http://localhost:{PORT}")
            print("🌐 Opening browser...")
            
            # Open browser automatically
            webbrowser.open(f'http://localhost:{PORT}')
            
            print("")
            print("Press Ctrl+C to stop the server")
            print("")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        sys.exit(0)
    except OSError as e:
        if e.errno == 10048:  # Port already in use on Windows
            print(f"❌ Port {PORT} is already in use")
            print("Please close any other applications using this port and try again")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
