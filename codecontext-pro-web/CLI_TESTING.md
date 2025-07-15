# 🧪 CodeContext Pro CLI Testing Guide

## End-to-End Authentication & Limit Testing

**CRITICAL:** Run these tests before taking real payments!

---

## 🔑 **Test Suite 1: Authentication Flow**

### Test 1.1: Login with Valid API Key
```bash
codecontext login
# Enter valid API key when prompted
# Expected: Success message, token stored locally
```

### Test 1.2: Login with Invalid API Key
```bash
codecontext login
# Enter invalid API key when prompted
# Expected: Error message, no token stored
```

### Test 1.3: Status Check After Login
```bash
codecontext status
# Expected: Shows user info, subscription tier, usage stats
```

### Test 1.4: Logout
```bash
codecontext logout
# Expected: Token cleared, subsequent commands require re-login
```

---

## ⚡ **Test Suite 2: Execution Limits (Starter Tier - 50 executions)**

### Test 2.1: Execute Within Limits
```bash
# Execute 49 times (should all work)
for i in {1..49}; do
  codecontext execute --language javascript --code "console.log('Test $i');"
done
# Expected: All executions succeed
```

### Test 2.2: Execute at Limit Boundary
```bash
# Execute 50th time (should work)
codecontext execute --language javascript --code "console.log('Test 50');"
# Expected: Success
```

### Test 2.3: Execute Beyond Limit
```bash
# Execute 51st time (should be blocked)
codecontext execute --language javascript --code "console.log('Test 51');"
# Expected: Error message about limit exceeded
```

### Test 2.4: Concurrent Execution Test
```bash
# Test race conditions - run multiple executions simultaneously
codecontext execute --language javascript --code "console.log('Concurrent 1');" &
codecontext execute --language javascript --code "console.log('Concurrent 2');" &
codecontext execute --language javascript --code "console.log('Concurrent 3');" &
wait
# Expected: Atomic transaction handling, no double-counting
```

---

## 📁 **Test Suite 3: File Tracking Limits (Starter Tier - 50 files)**

### Test 3.1: Track Files Within Limits
```bash
# Create and track 49 files
for i in {1..49}; do
  echo "console.log('File $i');" > test_file_$i.js
  codecontext memory add test_file_$i.js
done
# Expected: All files tracked successfully
```

### Test 3.2: Track File at Limit
```bash
# Track 50th file (should work)
echo "console.log('File 50');" > test_file_50.js
codecontext memory add test_file_50.js
# Expected: Success
```

### Test 3.3: Track File Beyond Limit
```bash
# Track 51st file (should be blocked)
echo "console.log('File 51');" > test_file_51.js
codecontext memory add test_file_51.js
# Expected: Error message about file limit exceeded
```

---

## 💳 **Test Suite 4: Subscription Upgrade Flow**

### Test 4.1: Upgrade from Starter to Professional
```bash
# User hits Starter limits, then upgrades
codecontext upgrade
# Expected: Redirect to payment page, after payment limits increase
```

### Test 4.2: Verify Professional Limits
```bash
# After upgrade, test new limits (700 executions, 1000 files)
codecontext status
# Expected: Shows Professional tier with higher limits
```

### Test 4.3: Execute with Professional Limits
```bash
# Test execution with new limits
codecontext execute --language javascript --code "console.log('Professional tier test');"
# Expected: Works even if previously at Starter limit
```

---

## 🔄 **Test Suite 5: Month Rollover Testing**

### Test 5.1: Simulate Month Rollover
```bash
# Manually trigger month rollover in database
# Reset usage counters to 0
# Expected: User can execute again up to their tier limits
```

### Test 5.2: Verify Limits Reset
```bash
codecontext status
# Expected: Usage counters show 0, limits remain same
```

---

## 🚨 **Test Suite 6: Security & Edge Cases**

### Test 6.1: API Key Tampering
```bash
# Manually edit stored token/API key
# Try to execute
# Expected: Authentication failure, forced re-login
```

### Test 6.2: Expired Token Handling
```bash
# Wait for token to expire (or manually expire it)
codecontext execute --language javascript --code "console.log('Test');"
# Expected: Automatic re-authentication or clear error message
```

### Test 6.3: Network Failure Handling
```bash
# Disconnect internet, try to execute
codecontext execute --language javascript --code "console.log('Test');"
# Expected: Clear error message about network connectivity
```

---

## 📊 **Test Suite 7: Professional Tier Testing (700/1000 limits)**

### Test 7.1: Professional Execution Limits
```bash
# Test Professional tier limits (700 executions)
# Execute 699 times (should work)
# Execute 700th time (should work)
# Execute 701st time (should be blocked)
```

### Test 7.2: Professional File Limits
```bash
# Test Professional tier file limits (1000 files)
# Track 999 files (should work)
# Track 1000th file (should work)
# Track 1001st file (should be blocked)
```

---

## ✅ **Success Criteria Checklist**

**ALL TESTS MUST PASS:**

- [ ] Authentication flow works correctly
- [ ] Starter tier limits enforced (50/50)
- [ ] Professional tier limits enforced (700/1000)
- [ ] Concurrent executions handled atomically
- [ ] Upgrade flow works seamlessly
- [ ] Month rollover resets usage
- [ ] Security edge cases handled gracefully
- [ ] Error messages are clear and helpful

---

## 🚀 **Automated Testing Script**

Create `test_cli.sh`:
```bash
#!/bin/bash
echo "🧪 Running CodeContext Pro CLI Tests..."

# Test authentication
echo "Testing authentication..."
codecontext login

# Test status
echo "Testing status..."
codecontext status

# Test execution limits
echo "Testing execution limits..."
# Add your test commands here

echo "✅ All tests completed!"
```

**Run before every deployment!** 🔒
