#!/usr/bin/env python3
"""Tiny static dev server for the Sunflower Garden site.

Usage:  python serve.py [port]      (default port 8000)
Then open http://localhost:8000
"""

import functools
import http.server
import os
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Always serve fresh files while developing.
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


class Server(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    handler = functools.partial(Handler, directory=ROOT)
    with Server(("127.0.0.1", PORT), handler) as httpd:
        print(f"Sunflower Garden site running at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
