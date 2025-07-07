// Simple analysis of component database slot requirements
const fs = require('fs');
const path = require('path');

// Read the ComponentDatabaseService file to analyze slot requirements
const servicePath = path.join(__dirname, 'services', 'ComponentDatabaseService.ts');
const serviceContent = fs.readFileSync(servicePath, 'utf8');

console.log('🔍 Analyzing Component Database Slot Requirements...\n');

// Look for endosteel structure data
console.log('📊 ENDOSTEEL STRUCTURE ANALYSIS:');
const endoSteelMatch = serviceContent.match(/id: 'endo_steel_structure'[\s\S]*?criticalSlots: \{([\s\S]*?)\}/);
if (endoSteelMatch) {
  console.log('🔧 Endo Steel (IS) Critical Slots:');
  console.log(endoSteelMatch[1].trim());
  
  // Count slots in each location
  const locations = endoSteelMatch[1].match(/(\w+): \[([^\]]*)\]/g);
  if (locations) {
    console.log('\n   Slot Distribution:');
    locations.forEach(loc => {
      const match = loc.match(/(\w+): \[([^\]]*)\]/);
      if (match) {
        const location = match[1];
        const slots = match[2].split(',').filter(s => s.trim() !== '').length;
        console.log(`   ${location}: ${slots} slots`);
      }
    });
  }
}

// Look for clan endosteel
const clanEndoMatch = serviceContent.match(/id: 'endo_steel_clan_structure'[\s\S]*?criticalSlots: \{([\s\S]*?)\}/);
if (clanEndoMatch) {
  console.log('\n🔧 Endo Steel (Clan) Critical Slots:');
  console.log(clanEndoMatch[1].trim());
  
  const locations = clanEndoMatch[1].match(/(\w+): \[([^\]]*)\]/g);
  if (locations) {
    console.log('\n   Slot Distribution:');
    locations.forEach(loc => {
      const match = loc.match(/(\w+): \[([^\]]*)\]/);
      if (match) {
        const location = match[1];
        const slots = match[2].split(',').filter(s => s.trim() !== '').length;
        console.log(`   ${location}: ${slots} slots`);
      }
    });
  }
}

// Look for ferro-fibrous armor
console.log('\n📊 FERRO-FIBROUS ARMOR ANALYSIS:');
const ferroMatch = serviceContent.match(/id: 'ferro_fibrous_armor'[\s\S]*?criticalSlots: \{([\s\S]*?)\}/);
if (ferroMatch) {
  console.log('🛡️ Ferro-Fibrous (IS) Critical Slots:');
  console.log(ferroMatch[1].trim());
  
  const locations = ferroMatch[1].match(/(\w+): \[([^\]]*)\]/g);
  if (locations) {
    console.log('\n   Slot Distribution:');
    locations.forEach(loc => {
      const match = loc.match(/(\w+): \[([^\]]*)\]/);
      if (match) {
        const location = match[1];
        const slots = match[2].split(',').filter(s => s.trim() !== '').length;
        console.log(`   ${location}: ${slots} slots`);
      }
    });
  }
}

// Look for clan ferro-fibrous
const clanFerroMatch = serviceContent.match(/id: 'ferro_fibrous_clan_armor'[\s\S]*?criticalSlots: \{([\s\S]*?)\}/);
if (clanFerroMatch) {
  console.log('\n🛡️ Ferro-Fibrous (Clan) Critical Slots:');
  console.log(clanFerroMatch[1].trim());
  
  const locations = clanFerroMatch[1].match(/(\w+): \[([^\]]*)\]/g);
  if (locations) {
    console.log('\n   Slot Distribution:');
    locations.forEach(loc => {
      const match = loc.match(/(\w+): \[([^\]]*)\]/);
      if (match) {
        const location = match[1];
        const slots = match[2].split(',').filter(s => s.trim() !== '').length;
        console.log(`   ${location}: ${slots} slots`);
      }
    });
  }
}

console.log('\n📋 BATTLEMECH CONSTRUCTION RULES REFERENCE:');
console.log('According to BattleTech rules:');
console.log('- Endo Steel (IS): 14 slots distributed across ANY location');
console.log('- Endo Steel (Clan): 7 slots distributed across ANY location');
console.log('- Ferro-Fibrous (IS): 14 slots distributed across ANY location');
console.log('- Ferro-Fibrous (Clan): 7 slots distributed across ANY location');
console.log('- Standard Structure: 0 slots');
console.log('- Standard Armor: 0 slots');

console.log('\n🎯 ANALYSIS:');
console.log('The component database is using FIXED slot locations');
console.log('instead of the correct "distributed across any location" approach.');
console.log('This is INCORRECT for endosteel and ferro-fibrous components.');
console.log('\n❌ PROBLEMS IDENTIFIED:');
console.log('1. Endosteel and Ferro-Fibrous should NOT have fixed slot locations');
console.log('2. They should have a total slot count that can be distributed');
console.log('3. The current implementation prevents proper slot allocation');
console.log('4. This breaks BattleTech construction rules'); 