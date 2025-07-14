import Docker from 'dockerode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Core interfaces for execution system
export interface ExecutionRequest {
  id: string;
  language: SupportedLanguage;
  code: string;
  tests?: string[];
  dependencies?: string[];
  timeout?: number;
  memoryLimit?: string;
  projectContext?: ProjectContext;
}

export interface ExecutionResult {
  id: string;
  success: boolean;
  output: string;
  errors: string[];
  exitCode: number;
  executionTime: number;
  memoryUsage: number;
  testResults?: TestResult[];
  performanceMetrics?: PerformanceMetrics;
  securityReport?: SecurityReport;
  improvements?: {
    codeImprovements: string[];
    performanceOptimizations: string[];
    securityEnhancements: string[];
  };
}

export interface TestResult {
  name: string;
  passed: boolean;
  output: string;
  error?: string;
  duration: number;
}

export interface PerformanceMetrics {
  cpuUsage: number;
  memoryPeak: number;
  ioOperations: number;
  networkCalls: number;
  executionProfile: ExecutionProfile[];
}

export interface ExecutionProfile {
  function: string;
  calls: number;
  totalTime: number;
  averageTime: number;
}

export interface SecurityReport {
  fileSystemAccess: string[];
  networkAccess: string[];
  processSpawned: string[];
  suspiciousOperations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ProjectContext {
  projectId: string;
  workingDirectory: string;
  installedPackages: string[];
  environmentVariables: Record<string, string>;
}

export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'go' | 'rust';

export class ExecutionEngine {
  private docker: Docker;
  private sandboxDir: string;
  private containers: Map<string, Docker.Container> = new Map();

  constructor(sandboxDir: string = './sandbox') {
    this.docker = new Docker();
    this.sandboxDir = path.resolve(sandboxDir);
    this.ensureSandboxDirectory();
  }

  async executeCode(request: ExecutionRequest): Promise<ExecutionResult> {
    const startTime = Date.now();
    const executionId = request.id || uuidv4();
    
    console.log(`🚀 Executing ${request.language} code (ID: ${executionId})`);

    try {
      // Create isolated execution environment
      const environment = await this.createExecutionEnvironment(request);
      
      // Execute code in sandbox
      const result = await this.runInSandbox(environment, request);
      
      // Run tests if provided
      if (request.tests && request.tests.length > 0) {
        result.testResults = await this.runTests(environment, request);
      }

      // Collect performance metrics
      result.performanceMetrics = await this.collectPerformanceMetrics(environment);
      
      // Generate security report
      result.securityReport = await this.generateSecurityReport(environment);
      
      // Cleanup
      await this.cleanupEnvironment(environment);
      
      result.executionTime = Date.now() - startTime;
      
      console.log(`✅ Execution completed in ${result.executionTime}ms`);
      return result;

    } catch (error) {
      console.error(`❌ Execution failed:`, error);
      return {
        id: executionId,
        success: false,
        output: '',
        errors: [error instanceof Error ? error.message : String(error)],
        exitCode: 1,
        executionTime: Date.now() - startTime,
        memoryUsage: 0
      };
    }
  }

  private async createExecutionEnvironment(request: ExecutionRequest): Promise<ExecutionEnvironment> {
    const envId = uuidv4();
    const envDir = path.join(this.sandboxDir, envId);
    
    await fs.ensureDir(envDir);
    
    // Write code to file
    const codeFile = await this.writeCodeToFile(envDir, request);
    
    // Create Docker container
    const container = await this.createContainer(request.language, envDir, request);
    
    return {
      id: envId,
      directory: envDir,
      codeFile,
      container,
      language: request.language
    };
  }

  private async writeCodeToFile(envDir: string, request: ExecutionRequest): Promise<string> {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      go: 'go',
      rust: 'rs'
    };

    const extension = extensions[request.language];
    const fileName = `main.${extension}`;
    const filePath = path.join(envDir, fileName);
    
    await fs.writeFile(filePath, request.code);
    
    // Write package.json for Node.js projects
    if (request.language === 'javascript' || request.language === 'typescript') {
      const packageJson = {
        name: 'codecontext-execution',
        version: '1.0.0',
        main: fileName,
        dependencies: this.getDependenciesObject(request.dependencies || [])
      };
      await fs.writeJson(path.join(envDir, 'package.json'), packageJson);
    }
    
    // Write requirements.txt for Python
    if (request.language === 'python' && request.dependencies) {
      await fs.writeFile(
        path.join(envDir, 'requirements.txt'),
        request.dependencies.join('\n')
      );
    }
    
    return fileName;
  }

  private async createContainer(
    language: SupportedLanguage,
    envDir: string,
    request: ExecutionRequest
  ): Promise<Docker.Container> {
    const images = {
      javascript: 'node:18-alpine',
      typescript: 'node:18-alpine',
      python: 'python:3.11-alpine',
      go: 'golang:1.20-alpine',
      rust: 'rust:1.70-alpine'
    };

    const image = images[language];
    
    const container = await this.docker.createContainer({
      Image: image,
      WorkingDir: '/workspace',
      Cmd: this.getExecutionCommand(language, request),
      HostConfig: {
        Binds: [`${envDir}:/workspace`],
        Memory: this.parseMemoryLimit(request.memoryLimit || '128m'),
        CpuShares: 512, // Limit CPU usage
        NetworkMode: 'none', // No network access by default
        ReadonlyRootfs: false, // Allow writes to workspace
        Tmpfs: {
          '/tmp': 'rw,noexec,nosuid,size=100m'
        }
      },
      Env: this.getEnvironmentVariables(request)
    });

    return container;
  }

  private getExecutionCommand(language: SupportedLanguage, request: ExecutionRequest): string[] {
    switch (language) {
      case 'javascript':
        return ['node', 'main.js'];
      case 'typescript':
        return ['sh', '-c', 'npm install -g typescript && npm install && npx tsc main.ts && node main.js'];
      case 'python':
        return ['sh', '-c', 'pip install -r requirements.txt 2>/dev/null || true && python main.py'];
      case 'go':
        return ['sh', '-c', 'go mod init main 2>/dev/null || true && go run main.go'];
      case 'rust':
        return ['sh', '-c', 'cargo init --name main . 2>/dev/null || true && cargo run'];
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private async runInSandbox(
    environment: ExecutionEnvironment,
    request: ExecutionRequest
  ): Promise<ExecutionResult> {
    const container = environment.container;
    
    await container.start();
    
    // Set timeout
    const timeout = request.timeout || 30000; // 30 seconds default
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Execution timeout')), timeout);
    });
    
    try {
      const stream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true
      });
      
      let output = '';
      let errors = '';
      
      stream.on('data', (chunk: any) => {
        const data = chunk.toString();
        if (chunk[0] === 1) { // stdout
          output += data.slice(8); // Remove Docker stream header
        } else if (chunk[0] === 2) { // stderr
          errors += data.slice(8);
        }
      });
      
      const waitResult = await Promise.race([
        container.wait(),
        timeoutPromise
      ]);
      
      const stats = await container.stats({ stream: false });
      const memoryUsage = stats.memory_stats?.usage || 0;
      
      return {
        id: environment.id,
        success: waitResult.StatusCode === 0,
        output: output.trim(),
        errors: errors ? [errors.trim()] : [],
        exitCode: waitResult.StatusCode,
        executionTime: 0, // Will be set by caller
        memoryUsage
      };
      
    } finally {
      await container.stop();
    }
  }

  private async runTests(
    environment: ExecutionEnvironment,
    request: ExecutionRequest
  ): Promise<TestResult[]> {
    // Implementation for running tests
    // This would create test files and run them
    return [];
  }

  private async collectPerformanceMetrics(
    environment: ExecutionEnvironment
  ): Promise<PerformanceMetrics> {
    // Implementation for collecting performance data
    return {
      cpuUsage: 0,
      memoryPeak: 0,
      ioOperations: 0,
      networkCalls: 0,
      executionProfile: []
    };
  }

  private async generateSecurityReport(
    environment: ExecutionEnvironment
  ): Promise<SecurityReport> {
    // Implementation for security analysis
    return {
      fileSystemAccess: [],
      networkAccess: [],
      processSpawned: [],
      suspiciousOperations: [],
      riskLevel: 'low'
    };
  }

  private async cleanupEnvironment(environment: ExecutionEnvironment): Promise<void> {
    try {
      await environment.container.remove();
      await fs.remove(environment.directory);
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  }

  private ensureSandboxDirectory(): void {
    fs.ensureDirSync(this.sandboxDir);
  }

  private getDependenciesObject(dependencies: string[]): Record<string, string> {
    const deps: Record<string, string> = {};
    dependencies.forEach(dep => {
      const [name, version] = dep.split('@');
      deps[name] = version || 'latest';
    });
    return deps;
  }

  private parseMemoryLimit(limit: string): number {
    const match = limit.match(/^(\d+)([kmg]?)$/i);
    if (!match) return 128 * 1024 * 1024; // 128MB default
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    switch (unit) {
      case 'k': return value * 1024;
      case 'm': return value * 1024 * 1024;
      case 'g': return value * 1024 * 1024 * 1024;
      default: return value;
    }
  }

  private getEnvironmentVariables(request: ExecutionRequest): string[] {
    const env = ['NODE_ENV=sandbox', 'PYTHONPATH=/workspace'];
    
    if (request.projectContext?.environmentVariables) {
      Object.entries(request.projectContext.environmentVariables).forEach(([key, value]) => {
        env.push(`${key}=${value}`);
      });
    }
    
    return env;
  }
}

interface ExecutionEnvironment {
  id: string;
  directory: string;
  codeFile: string;
  container: Docker.Container;
  language: SupportedLanguage;
}
