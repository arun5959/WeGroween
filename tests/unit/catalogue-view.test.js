import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shopQuery,shopDestination} from '../../src/app/catalogue-view.js';
import {products,shopCollections} from '../../src/content/foundation.js';
test('catalogue view and sort recover safely from URL queries',()=>{
 assert.deepEqual(shopQuery(''),{view:'selections',sort:'selection'});assert.deepEqual(shopQuery('?view=all&sort=price-desc'),{view:'all',sort:'price-desc'});assert.deepEqual(shopQuery('?view=unknown&sort=unknown'),{view:'selections',sort:'selection'});
 assert.equal(shopDestination('all','selections'),'/shop');assert.equal(shopDestination('all','all','price-asc'),'/shop?view=all&sort=price-asc');assert.equal(shopDestination('mushrooms','all','name-asc'),'/shop/category/mushrooms?sort=name-asc');
});
test('curated selections cover the existing product catalogue once',()=>{const slugs=shopCollections.flatMap(c=>c.slugs);assert.equal(new Set(slugs).size,slugs.length);assert.deepEqual([...slugs].sort(),products.map(p=>p.slug).sort());});
