#!/usr/bin/env python3
"""
TripoSR Service Test Script
Validates the service is working correctly before using with the app.
"""

import sys
import requests
from pathlib import Path


def test_health():
    """Test health endpoint."""
    print("Testing /health endpoint...")
    try:
        response = requests.get("http://127.0.0.1:8000/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Service is healthy")
            print(f"  Device: {data.get('device')}")
            print(f"  CUDA available: {data.get('cuda_available')}")
            print(f"  Model loaded: {data.get('model_loaded')}")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to service. Is it running?")
        print("  Run: python server.py")
        return False


def test_root():
    """Test root endpoint."""
    print("\nTesting / endpoint...")
    try:
        response = requests.get("http://127.0.0.1:8000/")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Root endpoint OK")
            print(f"  Status: {data.get('status')}")
            return True
        else:
            print(f"✗ Root check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_convert(image_path=None):
    """Test convert endpoint with a sample image."""
    print("\nTesting /convert endpoint...")
    
    if image_path and Path(image_path).exists():
        print(f"Using provided image: {image_path}")
        with open(image_path, "rb") as f:
            files = {"photo": f}
            try:
                print("Uploading and converting (this may take 10-20 seconds)...")
                response = requests.post(
                    "http://127.0.0.1:8000/convert", files=files, timeout=60
                )
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✓ Conversion successful!")
                    print(f"  GLB URL: {data.get('glbUrl')}")
                    print(f"  Task ID: {data.get('taskId')}")
                    return True
                else:
                    print(f"✗ Conversion failed: {response.status_code}")
                    print(f"  Error: {response.text}")
                    return False
            except requests.exceptions.Timeout:
                print("✗ Conversion timed out (>60s)")
                return False
            except Exception as e:
                print(f"✗ Error: {e}")
                return False
    else:
        print("⊘ Skipping conversion test (no test image provided)")
        print("  To test conversion, run:")
        print("  python test-service.py path/to/image.jpg")
        return None


def main():
    """Run all tests."""
    print("=" * 60)
    print("TripoSR Service Test Suite")
    print("=" * 60)
    print()

    results = []
    
    # Test health
    results.append(("Health Check", test_health()))
    
    # Test root
    results.append(("Root Endpoint", test_root()))
    
    # Test convert (if image provided)
    image_path = sys.argv[1] if len(sys.argv) > 1 else None
    convert_result = test_convert(image_path)
    if convert_result is not None:
        results.append(("Conversion Test", convert_result))
    
    print("\n" + "=" * 60)
    print("Test Results")
    print("=" * 60)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{name:.<40} {status}")
    
    all_passed = all(r for r in results if r[1] is not None)
    
    print()
    if all_passed:
        print("✓ All tests passed! Service is ready.")
        print("\nNext steps:")
        print("1. Make sure .env.local has TRIPOSR_API_URL=http://127.0.0.1:8000")
        print("2. Start your Next.js app: npm run dev")
        print("3. Open http://localhost:3000 and try importing a photo!")
        sys.exit(0)
    else:
        print("✗ Some tests failed. Check the output above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
