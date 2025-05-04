// debug-api.js
import StoryblokApi from './src/cms/storyblok.js';

console.log('Debugging StoryblokApi...');
console.log('-------------------------');

const api = new StoryblokApi();

console.log('Available methods on StoryblokApi instance:');
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(api)));

console.log('\nChecking specific methods:');
console.log('- getSiteConfig exists?', typeof api.getSiteConfig === 'function');
console.log('- getSiteConfiguration exists?', typeof api.getSiteConfiguration === 'function');

console.log('\nAll properties of the API instance:');
for (const prop in api) {
  console.log(`- ${prop}: ${typeof api[prop]}`);
}

console.log('\nPrototype chain:');
let proto = Object.getPrototypeOf(api);
while (proto) {
  console.log('Prototype:', proto.constructor.name);
  console.log('Methods:', Object.getOwnPropertyNames(proto));
  proto = Object.getPrototypeOf(proto);
}
