
// Test TypeScript interfaces for Lemon Squeezy
interface LemonSqueezyConfig {
  apiKey: string;
  storeId: string;
  variantIds: {
    basic: string;
    premium: string;
  };
}

interface UserSubscription {
  userId: string;
  tier: 'free' | 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  lemonSqueezyCustomerId?: string;
  lemonSqueezySubscriptionId?: string;
}

// Test configuration validation
function validateConfig(config: LemonSqueezyConfig): boolean {
  const required = ['apiKey', 'storeId'];
  for (const field of required) {
    if (!config[field]) {
      console.log('❌ Missing required field:', field);
      return false;
    }
  }
  
  if (!config.variantIds.basic || !config.variantIds.premium) {
    console.log('❌ Missing variant IDs');
    return false;
  }
  
  return true;
}

// Test with mock config
const mockConfig: LemonSqueezyConfig = {
  apiKey: 'test_api_key_123',
  storeId: 'store_456',
  variantIds: {
    basic: 'variant_basic_789',
    premium: 'variant_premium_101'
  }
};

console.log('🧪 Testing Lemon Squeezy configuration...');
const isValid = validateConfig(mockConfig);
console.log('✅ Configuration valid:', isValid);

// Test subscription creation
const testSubscription: UserSubscription = {
  userId: 'user_healthcare_123',
  tier: 'basic',
  status: 'active',
  lemonSqueezyCustomerId: 'cust_456',
  lemonSqueezySubscriptionId: 'sub_789'
};

console.log('📋 Test subscription:', JSON.stringify(testSubscription, null, 2));
console.log('🎯 TypeScript interfaces working correctly!');
