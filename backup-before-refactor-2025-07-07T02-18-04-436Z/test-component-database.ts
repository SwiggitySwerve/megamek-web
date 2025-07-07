// Simple test script to verify component database functionality
import { ComponentDatabaseService } from './services/ComponentDatabaseService';

async function testComponentDatabase() {
  console.log('🧪 Testing Component Database...');
  
  try {
    const db = ComponentDatabaseService.getInstance();
    
    // Test engine slot calculations
    console.log('\n📊 Testing Engine Slot Calculations:');
    const standardEngineSlots = db.getEngineCriticalSlots('standard_fusion_engine', 'standard_gyro');
    console.log('Standard Engine + Standard Gyro:', standardEngineSlots);
    
    const xlEngineSlots = db.getEngineCriticalSlots('xl_fusion_engine', 'standard_gyro');
    console.log('XL Engine + Standard Gyro:', xlEngineSlots);
    
    // Test gyro slot calculations
    console.log('\n📊 Testing Gyro Slot Calculations:');
    const standardGyroSlots = db.getGyroCriticalSlots('standard_gyro');
    console.log('Standard Gyro:', standardGyroSlots);
    
    const xlGyroSlots = db.getGyroCriticalSlots('xl_gyro');
    console.log('XL Gyro:', xlGyroSlots);
    
    // Test component queries
    console.log('\n📊 Testing Component Queries:');
    const engines = db.getEngines({ techBase: 'Inner Sphere', rulesLevel: 'Standard' });
    console.log('Inner Sphere Standard Engines:', engines.length, 'found');
    
    const gyros = db.getGyros({ techBase: 'Inner Sphere', rulesLevel: 'Standard' });
    console.log('Inner Sphere Standard Gyros:', gyros.length, 'found');
    
    console.log('\n✅ Component Database Test Completed Successfully!');
    
  } catch (error) {
    console.error('❌ Component Database Test Failed:', error);
  }
}

testComponentDatabase(); 