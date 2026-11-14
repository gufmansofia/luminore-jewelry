import {test,expect} from 'bun:test';
import {mergeAdminProducts} from '../src/data/admin-products';
import {products} from '../src/data/products';
test('approved removal excludes exactly one product without reassigning its SKU or ID',()=>{const p=products[0]!,remaining=mergeAdminProducts(products,[],[{id:p.id,sku:p.sku}]);expect(remaining).toHaveLength(products.length-1);expect(remaining.some(row=>row.id===p.id||row.sku===p.sku)).toBe(false);expect(remaining).toEqual(products.filter(row=>row!==p));});
test('removal rejects a mismatched identity and cannot overlap an incoming publication',()=>{const p=products[0]!;expect(()=>mergeAdminProducts(products,[],[{id:p.id+9999,sku:p.sku}])).toThrow('identity');expect(()=>mergeAdminProducts(products,[],[{id:p.id,sku:'P99999'}])).toThrow('identity');expect(()=>mergeAdminProducts(products,[{id:p.id,sku:p.sku} as any],[{id:p.id,sku:p.sku}])).toThrow('identity');});
