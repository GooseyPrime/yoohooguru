const { spawn } = require('child_process');
const path = require('path');

describe('Stripe Warning Messages', () => {
  const stripePath = path.join(__dirname, '../src/lib/stripe.js');
  
  test('should show development warning when NODE_ENV is development', (done) => {
    // Create clean environment without inheriting test NODE_ENV
    const cleanEnv = { ...process.env };
    delete cleanEnv.STRIPE_SECRET_KEY;
    cleanEnv.NODE_ENV = 'development';

    const child = spawn('node', ['-e', `
      process.env.NODE_ENV = 'development';
      delete process.env.STRIPE_SECRET_KEY;
      require('${stripePath}');
    `], {
      env: cleanEnv
    });
    
    let stderr = '';
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', () => {
      expect(stderr).toContain('For local development, add STRIPE_SECRET_KEY=sk_test_... to your .env file');
      expect(stderr).toContain('Stripe features will be disabled');
      expect(stderr).not.toContain('Set this in Railway');
      done();
    });
  });
  
  test('should show production warning when NODE_ENV is production', (done) => {
    // Create clean environment without inheriting test NODE_ENV
    const cleanEnv = { ...process.env };
    delete cleanEnv.STRIPE_SECRET_KEY;
    cleanEnv.NODE_ENV = 'production';

    const child = spawn('node', ['-e', `
      process.env.NODE_ENV = 'production';
      delete process.env.STRIPE_SECRET_KEY;
      require('${stripePath}');
    `], {
      env: cleanEnv
    });
    
    let stderr = '';
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', () => {
      expect(stderr).toContain('Set this in Railway or your production environment');
      expect(stderr).not.toContain('For local development');
      done();
    });
  });
  
  test('should show development warning when NODE_ENV is not set', (done) => {
    // Create clean environment without NODE_ENV
    const cleanEnv = { ...process.env };
    delete cleanEnv.NODE_ENV;
    delete cleanEnv.STRIPE_SECRET_KEY;

    const child = spawn('node', ['-e', `
      delete process.env.NODE_ENV;
      delete process.env.STRIPE_SECRET_KEY;
      require('${stripePath}');
    `], {
      env: cleanEnv
    });
    
    let stderr = '';
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', () => {
      expect(stderr).toContain('For local development, add STRIPE_SECRET_KEY=sk_test_... to your .env file');
      expect(stderr).toContain('Stripe features will be disabled');
      done();
    });
  });
  
  test('should not show warning when STRIPE_SECRET_KEY is set', (done) => {
    // Create clean environment with Stripe key set
    const cleanEnv = { ...process.env };
    cleanEnv.NODE_ENV = 'development';
    cleanEnv.STRIPE_SECRET_KEY = 'sk_test_fake_key';

    const child = spawn('node', ['-e', `
      process.env.NODE_ENV = 'development';
      process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key';
      require('${stripePath}');
    `], {
      env: cleanEnv
    });
    
    let stderr = '';
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', () => {
      expect(stderr).not.toContain('STRIPE_SECRET_KEY not set');
      done();
    });
  });
});