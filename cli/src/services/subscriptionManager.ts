import * as fs from 'fs-extra';
import * as path from 'path';
import { SubscriptionInfo, UsageStats, UsageLimits } from './memoryEngine';

export class SubscriptionManager {
  private configPath: string;
  private subscription: SubscriptionInfo | null = null;

  constructor(projectPath: string) {
    this.configPath = path.join(projectPath, '.codecontext', 'subscription.json');
  }

  async initialize(): Promise<void> {
    await this.loadSubscription();
    
    // If no subscription exists, create trial
    if (!this.subscription) {
      await this.createTrialSubscription();
    }
    
    // Check if monthly usage needs reset
    await this.checkAndResetMonthlyUsage();
  }

  async loadSubscription(): Promise<SubscriptionInfo | null> {
    try {
      if (await fs.pathExists(this.configPath)) {
        this.subscription = await fs.readJson(this.configPath);
        return this.subscription;
      }
    } catch (error) {
      console.warn('Failed to load subscription:', error);
    }
    return null;
  }

  async saveSubscription(): Promise<void> {
    if (this.subscription) {
      await fs.ensureDir(path.dirname(this.configPath));
      await fs.writeJson(this.configPath, this.subscription, { spaces: 2 });
    }
  }

  async createTrialSubscription(): Promise<void> {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

    this.subscription = {
      status: 'trial',
      tier: 'pro',
      userId: 'trial-user',
      expiresAt: trialEndDate.toISOString(),
      usage: {
        executionsThisMonth: 0,
        filesTracked: 0,
        lastResetDate: new Date().toISOString(),
        totalExecutions: 0
      },
      limits: {
        maxExecutionsPerMonth: 700,
        maxFilesTracked: 1000,
        advancedPatternRecognition: true,
        unlimitedMemory: true
      }
    };

    await this.saveSubscription();
    console.log('🎉 14-day trial started! Enjoy full CodeContext Pro features.');
  }

  async checkAndResetMonthlyUsage(): Promise<void> {
    if (!this.subscription) return;

    const lastReset = new Date(this.subscription.usage.lastResetDate);
    const now = new Date();
    
    // Check if we're in a new month
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      this.subscription.usage.executionsThisMonth = 0;
      this.subscription.usage.lastResetDate = now.toISOString();
      await this.saveSubscription();
      console.log('📊 Monthly usage reset - you have 700 fresh executions!');
    }
  }

  async canExecute(): Promise<{ allowed: boolean; reason?: string }> {
    if (!this.subscription) {
      return { allowed: false, reason: 'No subscription found' };
    }

    // Check subscription status
    if (this.subscription.status === 'expired' || this.subscription.status === 'cancelled') {
      return { allowed: false, reason: 'Subscription expired. Please renew at codecontextpro.com' };
    }

    // Check trial expiration
    if (this.subscription.status === 'trial') {
      const expiresAt = new Date(this.subscription.expiresAt);
      if (new Date() > expiresAt) {
        this.subscription.status = 'expired';
        await this.saveSubscription();
        return { allowed: false, reason: 'Trial expired. Upgrade to Pro at codecontextpro.com' };
      }
    }

    // Check execution limits
    if (this.subscription.usage.executionsThisMonth >= this.subscription.limits.maxExecutionsPerMonth) {
      return { 
        allowed: false, 
        reason: `Monthly execution limit reached (${this.subscription.limits.maxExecutionsPerMonth}). Resets next month or upgrade at codecontextpro.com` 
      };
    }

    return { allowed: true };
  }

  async canTrackFile(): Promise<{ allowed: boolean; reason?: string }> {
    if (!this.subscription) {
      return { allowed: false, reason: 'No subscription found' };
    }

    if (this.subscription.usage.filesTracked >= this.subscription.limits.maxFilesTracked) {
      return { 
        allowed: false, 
        reason: `File tracking limit reached (${this.subscription.limits.maxFilesTracked}). Upgrade at codecontextpro.com` 
      };
    }

    return { allowed: true };
  }

  async recordExecution(): Promise<void> {
    if (!this.subscription) return;

    this.subscription.usage.executionsThisMonth++;
    this.subscription.usage.totalExecutions++;
    await this.saveSubscription();
  }

  async recordFileTracked(): Promise<void> {
    if (!this.subscription) return;

    this.subscription.usage.filesTracked++;
    await this.saveSubscription();
  }

  getUsageStats(): UsageStats | null {
    return this.subscription?.usage || null;
  }

  getSubscriptionStatus(): SubscriptionInfo | null {
    return this.subscription;
  }

  async activatePaidSubscription(userId: string): Promise<void> {
    if (!this.subscription) {
      await this.createTrialSubscription();
    }

    if (this.subscription) {
      this.subscription.status = 'active';
      this.subscription.userId = userId;
      
      // Set expiration to one month from now
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      this.subscription.expiresAt = expiresAt.toISOString();
      
      await this.saveSubscription();
      console.log('🎉 CodeContext Pro activated! Welcome to unlimited AI memory.');
    }
  }

  getTrialDaysRemaining(): number {
    if (!this.subscription || this.subscription.status !== 'trial') {
      return 0;
    }

    const expiresAt = new Date(this.subscription.expiresAt);
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  getUsageSummary(): string {
    if (!this.subscription) {
      return 'No subscription found';
    }

    const usage = this.subscription.usage;
    const limits = this.subscription.limits;
    const status = this.subscription.status;

    let summary = `📊 Usage Summary:\n`;
    summary += `   Status: ${status.toUpperCase()}`;
    
    if (status === 'trial') {
      summary += ` (${this.getTrialDaysRemaining()} days remaining)`;
    }
    
    summary += `\n   Executions: ${usage.executionsThisMonth}/${limits.maxExecutionsPerMonth} this month\n`;
    summary += `   Files Tracked: ${usage.filesTracked}/${limits.maxFilesTracked}\n`;
    summary += `   Total Executions: ${usage.totalExecutions}\n`;
    
    if (status === 'trial' || status === 'expired') {
      summary += `\n💎 Upgrade to Pro: codecontextpro.com`;
    }

    return summary;
  }

  async extendTrial(days: number): Promise<void> {
    if (!this.subscription || this.subscription.status !== 'trial') {
      return;
    }

    const currentExpiry = new Date(this.subscription.expiresAt);
    currentExpiry.setDate(currentExpiry.getDate() + days);
    this.subscription.expiresAt = currentExpiry.toISOString();
    
    await this.saveSubscription();
    console.log(`🎉 Trial extended by ${days} days!`);
  }
}
